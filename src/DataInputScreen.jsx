import React, { useState, useRef } from 'react';
import { UploadCloud, Cpu, Database, PlayCircle, ShieldCheck, Lock } from 'lucide-react';

const DataInputScreen = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [txHash, setTxHash] = useState('');
  const [zkProofData, setZkProofData] = useState(null);
  
  const [enableZK, setEnableZK] = useState(true);
  const [assetCategory, setAssetCategory] = useState('text');
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);

  const handleViewDemo = () => {
    setAssetCategory('text');
    setInputText(`{\n  "domain": "Medical_AI_SFT",\n  "instruction": "分析该病例的重症风险评分...",\n  "knowledge_density": "High",\n  "source": "Private_Hospital_Archive_082"\n}`);
    setTimeout(() => processData(), 500);
  };

  const processData = () => {
    if (!inputText && assetCategory === 'text') return alert("请输入数据");

    setIsProcessing(true);
    setProgress(0);
    
    // ZK 模式与中心化上传模式的底层差异体验
    const steps = enableZK ? [
      { p: 10, text: '拦截网络上传！正在初始化 WebAssembly 本地运行环境...' },
      { p: 30, text: '正在下载预言机评分模型 (Oracle_Circuit.wasm) 到本地浏览器...' },
      { p: 60, text: '【本地离线计算】提取特征向量，生成哈希...' },
      { p: 80, text: '生成 zk-SNARK 零知识证明 (明文已销毁)...' },
      { p: 100, text: '仅向智能合约提交 Proof 与 Hash！验证成功！' }
    ] : [
      { p: 20, text: '正在打包明文数据...' },
      { p: 50, text: '正在通过 HTTPS 将数据上传至 Python 预言机...' },
      { p: 80, text: '预言机计算中...' },
      { p: 100, text: '确权完成！' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setStatusText(steps[current].text);
        
        if (enableZK && current === 3) {
            // 模拟生成 Groth16 零知识证明的结构
            setZkProofData({
                pi_a: ["0x1b...9a", "0x2c...7f"],
                pi_b: [["0x3a...", "0x4b..."], ["0x5c...", "0x6d..."]],
                pi_c: ["0x7e...2a", "0x8f...1b"],
                publicSignals: ["123456789012345678", "85"] // Hash & Score
            });
        }
        current++;
      } else {
        clearInterval(interval);
        setTxHash('0x' + Math.random().toString(16).slice(2, 12) + '...');
        setTimeout(() => {
          // 将模式状态传给下一个页面
          onComplete(inputText, assetCategory, enableZK);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-6">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative max-w-5xl w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <Database className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">AI-Echo 数据要素录入</h1>
          </div>
          <button onClick={handleViewDemo} className="flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 font-bold text-sm">
            <PlayCircle className="w-4 h-4 mr-2" /> 快速演示
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            {/* ZK 模式开关 */}
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer" onClick={() => setEnableZK(!enableZK)}>
                <div>
                    <h3 className="text-sm font-bold flex items-center text-white">
                        <Lock className={`w-4 h-4 mr-2 ${enableZK ? 'text-purple-500' : 'text-slate-500'}`} />
                        零知识证明 (zkML) 隐匿模式
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">本地提取特征打分，绝不向任何节点暴露明文数据</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${enableZK ? 'bg-purple-600' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${enableZK ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </div>
            </div>

            <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在此输入需要确权变现的语料..."
                className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 font-mono text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
            />

            <button 
              onClick={processData}
              disabled={isProcessing}
              className={`w-full py-4 font-black rounded-xl transition-all shadow-lg text-white ${enableZK ? 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:shadow-purple-500/20' : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-emerald-500/20'}`}
            >
              {isProcessing ? (enableZK ? 'ZK 电路运行中...' : '上传中...') : (enableZK ? '本地计算并生成 ZK Proof' : '明文上传至预言机')}
            </button>
          </div>

          <div className="bg-[#0a0f18] rounded-2xl border border-slate-800 p-6 font-mono relative overflow-hidden">
             {enableZK && isProcessing && <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-purple-900/20 animate-pulse" />}
             
             <div className={`flex items-center text-xs mb-4 border-b pb-2 ${enableZK ? 'text-purple-500 border-purple-900/50' : 'text-slate-500 border-slate-800'}`}>
                <Cpu className="w-4 h-4 mr-2" /> {enableZK ? 'LOCAL_WASM_CIRCUIT_LOGS' : 'SERVER_UPLOAD_LOGS'}
             </div>
             
             {isProcessing ? (
               <div className="space-y-4 relative z-10">
                  <div className={`flex justify-between text-xs ${enableZK ? 'text-purple-400' : 'text-emerald-400'}`}>
                    <span>{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${enableZK ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{width: `${progress}%`}}></div>
                  </div>
                  
                  {zkProofData && (
                      <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-[10px] text-purple-300">
                          <p className="font-bold text-purple-400 mb-1">// 生成的 Groth16 零知识证明凭证：</p>
                          <p>pi_a: [{zkProofData.pi_a[0]}...]</p>
                          <p>pi_b: [[{zkProofData.pi_b[0][0]}...]]</p>
                          <p>publicSignals: [ Hash: {zkProofData.publicSignals[0]}, Score: {zkProofData.publicSignals[1]} ]</p>
                      </div>
                  )}
                  {txHash && <div className={`p-3 text-[10px] rounded border ${enableZK ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>智能合约调用哈希: {txHash}</div>}
               </div>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-700 text-sm">
                 等待初始化...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputScreen;