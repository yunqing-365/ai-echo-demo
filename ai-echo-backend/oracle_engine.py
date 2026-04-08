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
import re

app = FastAPI(title="AI-Echo Oracle Engine (Academic & ZK Version)")

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print(">> 正在加载 Sentence-Transformers 语义嵌入模型，首次运行可能需要下载...")
chroma_client = chromadb.Client()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
collection = chroma_client.get_or_create_collection(name="global_corpus", embedding_function=sentence_transformer_ef)

# 注入基础对比语料
collection.add(
    documents=[
        "感冒了怎么办？建议多喝热水，注意休息，必要时服用退烧药。", 
        "Midjourney提示词：一个赛博朋克风格的城市，霓虹灯，下雨，8k分辨率，辛烷值渲染。", 
        "中国非遗技艺：榫卯结构是传统木作的核心，不用一根钉子。"
    ],
    metadatas=[{"source": "public_web"}, {"source": "public_web"}, {"source": "public_wiki"}],
    ids=["doc1", "doc2", "doc3"]
)
print(">> 全网基础向量语料库加载完毕！")

# 前端传入的数据结构
class AssetData(BaseModel):
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

# 核心算法：学术级特征提取
def evaluate_data_asset_rigorous(text: str, author_id: str, rag_distance: float):
    length = len(text)
    
    # 极短文本/垃圾数据拦截
    if length < 10:
        return {"entropy": 10, "snr": 10, "structure": 10, "scarcity": 10, "llm_value": 10, "credit": 80}

    # 1. 香农信息密度
    words = list(jieba.cut(text))
    shannon_entropy = calculate_shannon_entropy(words)
    normalized_entropy = min(100, max(20, (shannon_entropy / 7.5) * 100))

    # 2. 语料信噪比 (SNR)
    snr = calculate_signal_to_noise_ratio(text)
    normalized_snr = min(100, max(20, snr * 110))

    # 3. 结构与指令特征
    structure_score = 50
    if re.search(r'[{}:"]', text): structure_score += 15 
    if re.search(r'(怎么|如何|什么|why|how|what)[?？]', text): structure_score += 15 
    if re.search(r'
http://googleusercontent.com/immersive_entry_chip/0

替换保存并确认 Python 后端没有报错后，**请回复我“下一步”**，我马上把精简完整的 `App.jsx` 和 第一屏的代码发给你！