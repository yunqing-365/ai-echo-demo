import React, { useState } from 'react';
import { UploadCloud, Fingerprint, Cpu, Database, CheckCircle, Zap, ShieldAlert, Lock } from 'lucide-react';

const DataInputScreen = ({ onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [txHash, setTxHash] = useState('');
  const [enableZK, setEnableZK] = useState(true);
  const [zkProof, setZkProof] = useState('');
  const [inputText, setInputText] = useState(`{\n  "instruction": "如何判断智能合约重入攻击漏洞？",\n  "input": "",\n  "output": "检查 fallback 函数状态更新顺序"\n}`);

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(0);
    setTxHash('');
    setZkProof('');
    
    const steps = enableZK ? [
      { p: 10, text: '初始化 zk-SNARK 本地证明电路...' },
      { p: 35, text: '本地提取特征熵，数据不上链不脱域...' },
      { p: 60, text: '生成零知识证明 (ZK Proof)...' },
      { p: 85, text: '正在向预言机广播 ZK Proof 与哈希...' },
      { p: 100, text: '隐私确权成功！链上资产已生成。' }
    ] : [
      { p: 15, text: '正在验证语料格式与数据清洁度...' },
      { p: 40, text: '明文提取特征值，生成 SHA-256...' },
      { p: 65, text: '调用 KnowledgeRegistry.sol...' },
      { p: 90, text: '正在向联盟链广播确权交易...' },
      { p: 100, text: '确权成功！链上资产已生成。' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        if (enableZK && currentStep === 2) {
            setZkProof("0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setTxHash('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
        setTimeout(() => {
          if(onComplete) onComplete(inputText, enableZK); 
        }, 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden p-6 font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-5xl w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center space-x-5 mb-10 pb-6 border-b border-slate-700/50">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Database className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              AI-Echo 语料要素确权终端
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center">
              <Zap className="w-4 h-4 mr-1 text-teal-400" /> Proof of Contribution & Zero-Knowledge Protocol
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            
            <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${enableZK ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-slate-950/50 border-slate-700/50 hover:border-slate-500'}`} onClick={() => !isUploading && setEnableZK(!enableZK)}>
              <div className="flex items-center">
                {enableZK ? <Lock className="w-6 h-6 mr-3 text-emerald-400" /> : <ShieldAlert className="w-6 h-6 mr-3 text-slate-500" />}
                <div>
                  <p className={`text-sm font-bold ${enableZK ? 'text-emerald-400' : 'text-slate-400'}`}>zk-SNARK 数据可用不可见模式</p>
                  <p className="text-xs text-slate-500 mt-1">本地生成证明，绝密语料不脱离物理设备</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${enableZK ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enableZK ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                1. 选择数据资产类型
              </label>
              <select className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none">
                <option>高质量大模型微调语料 (SFT / JSON)</option>
                <option>核心未公开商业机密/算法专利集</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide flex justify-between">
                <span>2. 原始语料输入 (将在本地被粉碎)</span>
              </label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`w-full h-36 bg-slate-950/50 border rounded-xl p-4 font-mono text-sm focus:outline-none transition-all ${enableZK ? 'text-emerald-400/90 border-emerald-900/50 focus:border-emerald-500' : 'text-slate-300 border-slate-700/50 focus:border-blue-500'}`}
              />
            </div>

            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                isUploading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' 
                : enableZK
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:-translate-y-1'
                : 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:-translate-y-1'
              }`}
            >
              <UploadCloud className="w-6 h-6" />
              <span className="text-lg">{isUploading ? '系统处理中...' : enableZK ? '生成零知识证明并确权' : '明文上传并确权 (存在风险)'}</span>
            </button>
          </div>

          <div className="bg-[#0a0f18] rounded-2xl border border-slate-800 shadow-inner p-6 flex flex-col relative overflow-hidden group">
            <div className="flex space-x-2 absolute top-4 left-4">
              <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-4 mb-6 flex items-center justify-end border-b border-slate-800/80 pb-4">
              <Cpu className="w-4 h-4 mr-2" />
              Client-Side ZK Prover
            </h3>

            {isUploading || txHash ? (
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="relative pt-1">
                  <div className="flex mb-3 items-center justify-between">
                    <span className={`text-xs font-bold py-1 px-3 uppercase rounded-md border ${enableZK ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                      {enableZK ? 'ZK Circuit Running' : 'Standard Uploading'}
                    </span>
                    <span className={`text-sm font-bold font-mono ${enableZK ? 'text-emerald-400' : 'text-blue-400'}`}>{progress}%</span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                    <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out relative ${enableZK ? 'bg-gradient-to-r from-emerald-500 to-teal-300' : 'bg-blue-500'}`}>
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                <p className={`text-sm font-mono animate-pulse ${enableZK ? 'text-emerald-400/80' : 'text-blue-400/80'}`}>
                  {"> "} {statusText}
                </p>

                {zkProof && (
                  <div className="mt-2 p-3 bg-slate-900 border border-slate-700 rounded-lg animate-fade-in-up">
                    <p className="text-xs text-slate-500 mb-1">Generated ZK-SNARK Proof (Hidden Text):</p>
                    <p className="text-[10px] font-mono text-emerald-600 break-all leading-tight">{zkProof}</p>
                  </div>
                )}

                {txHash && (
                  <div className={`mt-6 p-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.1)] transform transition-all duration-500 translate-y-0 opacity-100 ${enableZK ? 'bg-emerald-950/30 border border-emerald-500/30' : 'bg-blue-950/30 border border-blue-500/30'}`}>
                    <div className={`flex items-center mb-3 ${enableZK ? 'text-emerald-400' : 'text-blue-400'}`}>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-bold tracking-wide">链上确权指纹 (TxHash)</span>
                    </div>
                    <p className={`text-xs font-mono break-all bg-black/40 p-3 rounded border ${enableZK ? 'text-emerald-200/60 border-emerald-900/50' : 'text-blue-200/60 border-blue-900/50'}`}>
                      {txHash}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600/50">
                <div className="relative">
                  <Lock className={`w-20 h-20 mb-4 transition-colors duration-500 ${enableZK ? 'opacity-50 text-emerald-500' : 'opacity-30'}`} />
                  {enableZK && <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-100 animate-pulse"></div>}
                </div>
                <p className="text-sm font-mono tracking-widest mt-2">{enableZK ? 'READY FOR ZK COMPILATION' : 'WAITING FOR DATA STREAM...'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputScreen;