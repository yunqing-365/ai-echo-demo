import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRight, ShieldCheck, Database, Link as LinkIcon, Hexagon, Zap, CheckCircle, Activity, Server } from 'lucide-react';

const SmartSplitScreen = ({ onRestart }) => {
  const [txStatus, setTxStatus] = useState('idle'); // idle, processing, success
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleSimulatePayment = () => {
    setTxStatus('processing');
    setLogs([]);
    
    // 模拟智能合约执行流程
    setTimeout(() => addLog('>> 监听到 B 端大模型厂商 API 调用请求...'), 500);
    setTimeout(() => addLog('>> 正在锁定支付资金: 4,285 Credits...'), 1500);
    setTimeout(() => addLog('>> 触发 SmartSplitBill.sol 智能合约...'), 2500);
    setTimeout(() => addLog('>> 获取 Oracle 预言机价值权重 (创作者: 82.5%, 节点: 10%, 社区: 7.5%)...'), 3500);
    setTimeout(() => addLog('>> 正在执行 Token 跨地址清算与转账...'), 4500);
    setTimeout(() => {
      addLog('>> [SUCCESS] 交易已打包入块！Block Height: #8492041');
      setTxStatus('success');
    }, 5500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#050b14] overflow-hidden p-6 font-sans">
      {/* 极简网格与光效背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-6xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col">
        
        {/* 头部标题区域 */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <LinkIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-white">
                SmartSplit 链上智能分账清算台
              </h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center font-mono">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> Contract: 0x8F9...3C2A | Trustless Settlement
              </p>
            </div>
          </div>
          
          <button 
            onClick={onRestart}
            className="text-sm text-slate-500 hover:text-emerald-400 transition-colors border border-slate-700 hover:border-emerald-500/50 px-4 py-2 rounded-lg"
          >
            返回首页重置 Demo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* 左侧：B 端调用者控制台 */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <Server className="w-4 h-4 mr-2 text-blue-400" /> 模拟 B 端数据消费
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">调用方 (API Caller)</p>
                  <p className="text-sm text-white font-mono flex items-center">
                    <Hexagon className="w-4 h-4 mr-2 text-blue-500" /> Medical-LLM-Corp
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">请求资产哈希</p>
                  <p className="text-xs text-emerald-400 font-mono truncate">0x9a7b...f1c2 (Med-QnA-Core)</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                  <p className="text-xs text-slate-500">账单金额</p>
                  <p className="text-lg font-bold text-white font-mono">4,285 <span className="text-xs text-emerald-500">CRD</span></p>
                </div>
              </div>

              <button 
                onClick={handleSimulatePayment}
                disabled={txStatus !== 'idle'}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${
                  txStatus === 'idle' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1' 
                  : txStatus === 'processing'
                  ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700'
                  : 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 cursor-not-allowed'
                }`}
              >
                {txStatus === 'idle' && <><Zap className="w-5 h-5" /> <span>模拟付款并触发合约</span></>}
                {txStatus === 'processing' && <><Activity className="w-5 h-5 animate-spin" /> <span>合约正在清算...</span></>}
                {txStatus === 'success' && <><CheckCircle className="w-5 h-5" /> <span>清算已完成</span></>}
              </button>
            </div>

            {/* 终端日志 */}
            <div className="flex-1 bg-black/60 border border-slate-800 rounded-2xl p-5 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Contract Logs</h3>
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <p key={i} className={`text-xs font-mono ${log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {log}
                  </p>
                ))}
                {txStatus === 'processing' && (
                  <p className="text-xs font-mono text-emerald-500/50 animate-pulse">_</p>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：资金流向拓扑图 */}
          <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-8 relative flex flex-col items-center justify-center">
            
            {/* 顶端：资金池 */}
            <div className={`relative z-10 p-6 rounded-2xl border-2 flex flex-col items-center w-64 bg-slate-900 transition-all duration-700 ${txStatus !== 'idle' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-slate-700'}`}>
              <Database className={`w-10 h-10 mb-2 ${txStatus !== 'idle' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <p className="text-sm text-slate-400 mb-1">SmartSplit 资金池</p>
              <p className="text-2xl font-mono font-bold text-white">
                {txStatus === 'idle' ? '0.00' : '4,285.00'}
              </p>
            </div>

            {/* 中间：分流连接线 (使用 CSS 实现流动动画) */}
            <div className="h-24 w-full relative flex justify-center">
              {/* 中轴线 */}
              <div className={`absolute top-0 w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : ''}`}></div>
              
              {/* 横向分发线 */}
              <div className={`absolute top-12 w-[70%] h-[2px] bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : ''}`}></div>
              
              {/* 三个向下分支线 */}
              <div className={`absolute top-12 left-[15%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 left-[50%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 right-[15%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>

              {/* 动画流动粒子 */}
              {txStatus === 'success' && (
                <>
                  <div className="absolute top-0 w-2 h-2 bg-white rounded-full animate-[drop_1.5s_ease-in-out_infinite]"></div>
                </>
              )}
            </div>

            {/* 底端：三个接收方钱包 */}
            <div className="w-full flex justify-between px-4">
              
              {/* 接收方 1 */}
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-300 ${txStatus === 'success' ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <Wallet className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">内容创作者 (82.5%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>
                  {txStatus === 'success' ? '+ 3,535.12' : '0.00'}
                </p>
              </div>

              {/* 接收方 2 */}
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-500 ${txStatus === 'success' ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <Activity className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-blue-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">平台运维节点 (10.0%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>
                  {txStatus === 'success' ? '+ 428.50' : '0.00'}
                </p>
              </div>

              {/* 接收方 3 */}
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-700 ${txStatus === 'success' ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <ShieldCheck className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-purple-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">生态激励基金 (7.5%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>
                  {txStatus === 'success' ? '+ 321.38' : '0.00'}
                </p>
              </div>

            </div>

            {/* 成功状态巨大印章水印 */}
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-all duration-700 ${txStatus === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
              <div className="border-4 border-emerald-500/20 text-emerald-500/20 rounded-full w-96 h-96 flex items-center justify-center -rotate-12">
                <span className="text-6xl font-black uppercase tracking-widest">Settled</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* 补充：简单的下降动画样式 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default SmartSplitScreen;