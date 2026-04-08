import os
os.environ['HF_ENDPOINT'] = 'https://hf-mirror.com'

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import hashlib
import math
from collections import Counter
import chromadb
from chromadb.utils import embedding_functions
import jieba
import jieba.posseg as pseg  # 【新增】词性标注，用于抽取实体
import re
import random

app = FastAPI(title="AI-Echo Multimodal Oracle Engine (Enterprise Version)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print(">> 正在加载多模态与图谱基础模型环境...")
chroma_client = chromadb.Client()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
collection = chroma_client.get_or_create_collection(name="global_corpus", embedding_function=sentence_transformer_ef)

# ==========================================
# 【核心升级】简易全网知识图谱 (Graph Memory)
# 真实生产中应为 Neo4j，此处使用内存 Set 构建共现边
# ==========================================
global_graph_edges = set()

def extract_entities_and_edges(text):
    """
    真实提取文本中的实体，并构建共现网络（Graph Edges）
    """
    words = pseg.cut(text)
    entities = []
    # 提取名词(n)、人名(nr)、地名(ns)、专有名词(nz)作为图谱节点
    for word, flag in words:
        if flag.startswith('n'): 
            entities.append(word)

    edges = set()
    # 构建滑动窗口共现关系（图的边）
    for i in range(len(entities)):
        for j in range(i+1, min(i+3, len(entities))): # 滑动窗口为3
            edge = tuple(sorted([entities[i], entities[j]]))
            edges.add(edge)
    return edges

# 注入多模态基础对比语料
base_corpus = [
    "文本：感冒了怎么办？建议多喝热水，注意休息，必要时服用退烧药。", 
    "文本：Midjourney提示词：一个赛博朋克风格的城市，霓虹灯，下雨，8k分辨率，辛烷值渲染。", 
    "图像特征：色彩丰富，高分辨率，赛博朋克风格，包含霓虹灯和雨景",
    "音频特征：高频人声，背景底噪低，梅尔频谱清晰"
]

collection.add(
    documents=base_corpus,
    metadatas=[{"source": "public_web"}] * 4,
    ids=["doc1", "doc2", "doc3", "doc4"]
)

# 初始化基础语料图谱
for text in base_corpus:
    global_graph_edges.update(extract_entities_and_edges(text))

print(f">> 基础向量库加载完毕！当前全网图谱边(Edges)数量: {len(global_graph_edges)}")

class AssetData(BaseModel):
    asset_category: str  
    asset_type: str
    description: str     
    author_id: str
    is_zk_mode: bool = True

def calculate_ahp_weight():
    return np.array([0.35, 0.25, 0.40])

def calculate_entropy_weight(data_matrix):
    p = data_matrix / data_matrix.sum(axis=0)
    p = np.where(p == 0, 1e-10, p)
    entropy = -np.sum(p * np.log(p), axis=0) / np.log(len(data_matrix))
    return (1 - entropy) / np.sum(1 - entropy)

def calculate_shannon_entropy(words):
    if not words: return 0
    word_counts = Counter(words)
    total_words = len(words)
    return -sum((count / total_words) * math.log2(count / total_words) for count in word_counts.values())

def calculate_signal_to_noise_ratio(text: str):
    total_chars = len(text)
    if total_chars == 0: return 0
    valid_chars = re.findall(r'[\u4e00-\u9fa5a-zA-Z0-9{}[\]()<>:;.,!?_=\-/"\']', text)
    return len(valid_chars) / total_chars

global_demand_ledger = {
    "medical_sft": 150,  # 医疗语料已经被调用了 150 次
    "legal_doc": 12,     # 法律语料调用 12 次
    "general": 5         # 通用语料调用 5 次
}

def apply_bonding_curve(base_value: float, domain_key: str):
    """
    使用对数联合曲线模型： P = P_base * (1 + α * log(1 + N))
    N 为市场调用次数，α 为曲线陡峭度（控制涨价速度）
    """
    # 模拟获取当前领域的调用次数
    current_supply_demand = global_demand_ledger.get(domain_key, 0)
    
    # 每次被调用，需求量+1
    global_demand_ledger[domain_key] = current_supply_demand + 1
    
    alpha = 0.15 # 联合曲线斜率参数
    # 计算溢价乘数
    premium_multiplier = 1 + alpha * math.log(1 + current_supply_demand)
    
    # 计算最终动态市场价格
    dynamic_market_price = base_value * premium_multiplier
    
    return dynamic_market_price, current_supply_demand + 1, premium_multiplier

# ==========================================
# 【核心升级】基于 GraphRAG 的特征提取
# ==========================================
def extract_text_features(text: str, vector_distance: float):
    length = len(text)
    if length < 10:
        return {"entropy": 10, "snr": 10, "structure": 10, "scarcity": 10, "llm_value": 10}

    # 1. 香农熵与信噪比
    words = list(jieba.cut(text))
    shannon_entropy = calculate_shannon_entropy(words)
    normalized_entropy = min(100, max(20, (shannon_entropy / 7.5) * 100))
    normalized_snr = min(100, max(20, calculate_signal_to_noise_ratio(text) * 110))

    # 2. 逻辑结构分
    structure_score = 50
    if re.search(r'[{}:"]', text): structure_score += 15 
    if re.search(r'(怎么|如何|什么|why|how|what)[?？]', text): structure_score += 15 
    structure_score = min(100, structure_score)

    # 3. GraphRAG 图谱反洗稿比对 (真实计算！)
    local_edges = extract_entities_and_edges(text)
    if not local_edges:
        graph_overlap_ratio = 1.0 # 提不出实体，判定为低质/重合度极高
    else:
        overlap = len(local_edges.intersection(global_graph_edges))
        graph_overlap_ratio = overlap / len(local_edges)
        global_graph_edges.update(local_edges) # 更新全网图谱

    # 【深度防伪逻辑】
    # 如果向量距离大（看似稀缺），但图谱重合度高（逻辑骨架一样），说明是洗稿！
    # 真正的稀缺 = 向量距离大 + 图谱重合度低
    graph_scarcity = 100 * (1 - graph_overlap_ratio)
    vector_scarcity = vector_distance * 70 
    
    # 惩罚因子：以图谱稀缺度为核心修正
    final_scarcity = min(100, max(20, (graph_scarcity * 0.7) + (vector_scarcity * 0.3)))
    
    llm_value = (normalized_entropy * 0.4) + (final_scarcity * 0.6)

    return {
        "entropy": normalized_entropy,
        "snr": normalized_snr,
        "structure": structure_score,
        "scarcity": final_scarcity,
        "llm_value": llm_value
    }

def extract_image_features(description: str, rag_distance: float):
    base_quality = random.uniform(70, 95)
    return {
        "entropy": base_quality + random.uniform(-5, 5),          
        "snr": min(100, base_quality + 10),                       
        "structure": base_quality + random.uniform(-10, 10),      
        "scarcity": min(100, max(40, rag_distance * 70)),         
        "llm_value": base_quality + 5                             
    }

def extract_audio_features(description: str, rag_distance: float):
    base_quality = random.uniform(65, 90)
    return {
        "entropy": base_quality + random.uniform(-8, 8),          
        "snr": min(100, base_quality + 15),                       
        "structure": base_quality + random.uniform(-5, 5),        
        "scarcity": min(100, max(40, rag_distance * 65)),         
        "llm_value": base_quality + 8                             
    }

@app.post("/api/valuate")
async def run_valuation(asset: AssetData):
    print("="*50)
    print(f"[{'ZK盲态' if asset.is_zk_mode else '明文'}预言机] 接收到 {asset.asset_category} 类别数据。")

    # 1. Vector RAG 检索
    results = collection.query(query_texts=[asset.description], n_results=1)
    distance = results['distances'][0][0] if results['distances'] else 0.8
    print(f"[Vector-RAG] 向量空间距离: {distance:.4f}")

    # 2. 执行 GraphRAG 增强特征提取
    if asset.asset_category == 'image':
        features = extract_image_features(asset.description, distance)
        metric_names = ["视觉像素丰富度 (AHP)", "图像清晰/低噪度 (AHP)", "构图与语义连贯 (AHP)", "视觉风格稀缺度 (熵权)", "多模态模型增益 (熵权)", "节点履约信用"]
    elif asset.asset_category == 'audio':
        features = extract_audio_features(asset.description, distance)
        metric_names = ["梅尔频谱丰富度 (AHP)", "声学信噪比 (AHP)", "音轨时序连贯性 (AHP)", "声纹特征稀缺度 (熵权)", "语音大模型增益 (熵权)", "节点履约信用"]
    else: 
        features = extract_text_features(asset.description, distance)
        metric_names = ["香农信息密度 (AHP)", "语料信噪比 (AHP)", "结构与指令连贯 (AHP)", "GraphRAG 拓扑稀缺度", "预期大模型增益 (熵权)", "节点履约信用"]
        print(f"[Graph-RAG] 计算完毕，图谱拓扑稀缺度得分: {features['scarcity']:.1f}")

    # 3. 动态数学熔炼引擎 (AHP + 熵权)
    w_ahp = calculate_ahp_weight()
    mock_objective_data = np.array([
        [features["scarcity"], features["llm_value"]],
        [random.uniform(50, 80), random.uniform(40, 70)],
        [random.uniform(60, 90), random.uniform(50, 80)]
    ])
    w_entropy = calculate_entropy_weight(mock_objective_data)

    alpha, beta = 0.6, 0.4
    final_scarcity = (features["scarcity"] * w_ahp[0] * alpha) + (features["scarcity"] * w_entropy[0] * beta) + (features["scarcity"] * 0.4)
    final_llm_value = (features["llm_value"] * w_ahp[1] * alpha) + (features["llm_value"] * w_entropy[1] * beta) + (features["llm_value"] * 0.4)
    
    credit_score = random.uniform(90, 99)

    # 4. 基础内在价值计算 (基于特征)
    base_value = (features["entropy"] * 0.2 + features["snr"] * 0.2 + features["structure"] * 0.2 + final_scarcity * 0.2 + final_llm_value * 0.2) * 100

    # ==========================================
    # 5. 触发 Bonding Curve 动态市场定价
    # ==========================================
    # 简单模拟：如果文本包含医疗相关词汇，判定为 medical_sft 领域
    domain_key = "general"
    if "医疗" in asset.description or "病例" in asset.description or "药" in asset.description:
        domain_key = "medical_sft"
    elif "法律" in asset.description or "合同" in asset.description:
        domain_key = "legal_doc"

    dynamic_price, new_demand, multiplier = apply_bonding_curve(base_value, domain_key)

    print(f"[AMM 做市商引擎] 领域: {domain_key} | 累计需求: {new_demand} 次")
    print(f"[AMM 做市商引擎] 联合曲线溢价乘数: {multiplier:.2f}x | 最终结算报价: {dynamic_price:.2f} Credits")
    print("="*50)

    return {
        "status": "success",
        "asset_hash": "0x" + hashlib.md5(asset.description.encode()).hexdigest() + "040x",
        "metrics": [
            {"subject": metric_names[0], "score": round(features["entropy"])},
            {"subject": metric_names[1], "score": round(features["snr"])},
            {"subject": metric_names[2], "score": round(features["structure"])},
            {"subject": metric_names[3], "score": round(final_scarcity)}, 
            {"subject": metric_names[4], "score": round(final_llm_value)},
            {"subject": metric_names[5], "score": round(credit_score)},
        ],
        "final_valuation": {
            "base_value": round(dynamic_price), # 返回经过联合曲线暴击后的市场真实价格！
            "creator_ratio": 82.5,
            "node_ratio": 10.5,
            "fund_ratio": 7.0
        }
    }