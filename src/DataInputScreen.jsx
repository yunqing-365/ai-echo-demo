import React, { useState, useRef } from 'react';
import { UploadCloud, Cpu, Database, CheckCircle, Zap, ShieldAlert, Lock, Image as ImageIcon, FileAudio, FileText, PlayCircle } from 'lucide-react';

const DataInputScreen = ({ onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [txHash, setTxHash] = useState('');
  const [enableZK, setEnableZK] = useState(true);
  const [assetCategory, setAssetCategory] = useState('text');
  const [inputText, setInputText] = useState('');
  const [zkProof, setZkProof] = useState('');
  const fileInputRef = useRef(null);

  // 【功能1】查看演示：自动填充高价值语料
  const handleViewDemo = () => {
    setAssetCategory('text');
    const demoData = `{\n  "domain": "Medical_AI_SFT",\n  "instruction": "分析该病例的重症风险评分...",\n  "knowledge_density": "High",\n  "source": "Private_Hospital_Archive_082"\n}`;
    setInputText(demoData);
    setTimeout(() => handleUpload(demoData), 500);
  };

  // 【功能2】真实上传：触发本地文件选择
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 模拟读取文件并提取特征
      setStatusText(`正在解析文件: ${file.name}...`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result.slice(0, 100); // 仅取样前100字节作为评估特征
        handleUpload(fileContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (dataToProcess) => {
    const data = dataToProcess || inputText;
    if (!data && assetCategory === 'text') return alert("请输入或选择语料");

    setIsUploading(true);
    setProgress(0);
    
    // 真实与模拟结合的进度逻辑
    const steps = [
      { p: 20, text: '启动本地 zk-SNARK Prover...' },
      { p: 50, text: assetCategory === 'text' ? '计算香农信息熵特征...' : '提取多模态向量张量...' },
      { p: 80, text: '封装零知识证明并请求预言机...' },
      { p: 100, text: '链上确权成功！' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setStatusText(steps[current].text);
        if (current === 2) setZkProof("0xZK" + Math.random().toString(16).slice(2, 10) + "...");
        current++;
      } else {
        clearInterval(interval);
        setTxHash('0x' + Math.random().toString(16).slice(2, 12) + '...');
        setTimeout(() => {
          onComplete(data, assetCategory, enableZK);
        }, 1500);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-6">
      {/* 隐藏的文件上传组件 */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={assetCategory === 'image' ? 'image/*' : 'audio/*'} />

      <div className="relative max-w-5xl w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <Database className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">AI-Echo 资产进入流程</h1>
          </div>
          {/* 查看演示按钮 */}
          <button 
            onClick={handleViewDemo}
            className="flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all font-bold text-sm"
          >
            <PlayCircle className="w-4 h-4 mr-2" /> 查看演示
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* 模式选择 */}
            <div className="flex space-x-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {['text', 'image', 'audio'].map(cat => (
                    <button key={cat} onClick={() => setAssetCategory(cat)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${assetCategory === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* 输入区 */}
            <div className="relative">
              {assetCategory === 'text' ? (
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此输入高质量 SFT 语料 JSON..."
                  className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 font-mono text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <div 
                  onClick={triggerFileUpload}
                  className="w-full h-40 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
                >
                  <UploadCloud className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">点击上传真实的 {assetCategory.toUpperCase()} 资产</p>
                  <p className="text-xs text-slate-600 mt-1">支持真实文件进入预言机评估流程</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleUpload()}
              disabled={isUploading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-black rounded-xl hover:-translate-y-1 transition-all shadow-lg"
            >
              {isUploading ? '正在执行 ZK 确权...' : '确认上传并启动价值评估'}
            </button>
          </div>

          {/* 控制台保持之前的逻辑，略 */}
          <div className="bg-black/40 rounded-2xl border border-slate-800 p-6 font-mono">
             <div className="flex items-center text-xs text-slate-500 mb-4 border-b border-slate-800 pb-2">
                <Cpu className="w-4 h-4 mr-2" /> MULTIMODAL_PROVER_LOGS
             </div>
             {isUploading ? (
               <div className="space-y-4">
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                  </div>
                  {zkProof && <div className="text-[10px] text-emerald-700 break-all">{zkProof}</div>}
                  {txHash && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded">确权哈希: {txHash}</div>}
               </div>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-700 text-sm">
                 等待资产输入...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputScreen;