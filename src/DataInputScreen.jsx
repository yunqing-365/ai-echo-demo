import React, { useState } from 'react';
import { UploadCloud, Fingerprint, Cpu, Database, CheckCircle, Zap } from 'lucide-react';

const DataInputScreen = ({ onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [txHash, setTxHash] = useState('');
  
  // 新增：用于存储文本框里的输入内容
  const [inputText, setInputText] = useState(`{\n  "dataset_name": "Med-QnA-Core-v2",\n  "size": "15,000 pairs",\n  "author_id": "Node-7A9B",\n  "cleanliness_score": 0.98\n}`);

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(0);
    setTxHash('');
    
    const steps = [
      { p: 15, text: '正在验证语料格式与数据清洁度...' },
      { p: 40, text: '调用 KnowledgeRegistry.sol 智能合约...' },
      { p: 65, text: '提取多维特征值，生成 SHA-256 数据指纹...' },
      { p: 90, text: '正在向联盟链广播确权交易...' },
      { p: 100, text: '确权成功！链上资产已生成。' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTxHash('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
        setTimeout(() => {
          // 修改点：跳转第二页时，把输入的文本内容传过去
          if(onComplete) onComplete(inputText); 
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
              <Zap className="w-4 h-4 mr-1 text-teal-400" /> Proof of Contribution - 优质语料确权与上链协议
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                1. 选择数据资产类型
              </label>
              <select className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer">
                <option>高质量大模型微调语料 (医疗问答场景)</option>
                <option>Midjourney 商业级高阶 Prompt 库</option>
                <option>科研机构未公开核心算法专利集</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide flex justify-between">
                <span>2. 数据要素特征值/摘要</span>
                <span className="text-emerald-500 text-xs font-normal animate-pulse">支持实时修改</span>
              </label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-36 bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400/90 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                isUploading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1'
              }`}
            >
              <UploadCloud className="w-6 h-6" />
              <span className="text-lg">{isUploading ? '系统处理中...' : '注入数据并启动上链确权'}</span>
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
              Node Processing Log
            </h3>

            {isUploading || txHash ? (
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="relative pt-1">
                  <div className="flex mb-3 items-center justify-between">
                    <span className="text-xs font-bold py-1 px-3 uppercase rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      合约执行中
                    </span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {progress}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                    <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500 ease-out relative">
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-emerald-400/80 font-mono animate-pulse">
                  {"> "} {statusText}
                </p>

                {txHash && (
                  <div className="mt-6 p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.1)] transform transition-all duration-500 translate-y-0 opacity-100">
                    <div className="flex items-center text-emerald-400 mb-3">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-bold tracking-wide">链上确权指纹 (TxHash)</span>
                    </div>
                    <p className="text-xs font-mono text-emerald-200/60 break-all bg-black/40 p-3 rounded border border-emerald-900/50">
                      {txHash}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600/50">
                <div className="relative">
                  <Fingerprint className="w-20 h-20 mb-4 opacity-30 group-hover:text-emerald-500/30 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                <p className="text-sm font-mono tracking-widest mt-2">WAITING FOR DATA STREAM...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputScreen;