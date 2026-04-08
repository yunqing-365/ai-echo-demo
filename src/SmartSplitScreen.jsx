import React, { useState } from 'react';
import { Wallet, ShieldCheck, Database, Link as LinkIcon, Hexagon, Zap, CheckCircle, Activity, Server } from 'lucide-react';

const SmartSplitScreen = ({ onRestart }) => {
  const [txStatus, setTxStatus] = useState('idle'); 
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const handleSimulatePayment = () => {
    setTxStatus('processing');
    setLogs([]);
    setTimeout(() => addLog('>> 监听到 B 端大模型厂商 API 调用请求...'), 500);
    setTimeout(() => addLog('>> 正在锁定支付资金: 8,425 Credits...'), 1500);
    setTimeout(() => addLog('>> 触发 SmartSplitBill.sol 智能合约...'), 2500);
    setTimeout(() => addLog('>> 获取 Oracle 预言机价值权重 (创作者: 82.5%, 节点: 10.5%, 社区: 7.0%)...'), 3500);
    setTimeout(() => addLog('>> 正在执行 Token 跨地址清算与转账...'), 4500);
    setTimeout(() => {
      addLog('>> [SUCCESS] 交易已打包入块！Block Height: #8492041');
      setTxStatus('success');
    }, 5500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#050b14] overflow-hidden p-6 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-6xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <LinkIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-white">SmartSplit 链上智能分账清算台</h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center font-mono">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> Contract: 0x8F9...3C2A | Trustless Settlement
              </p>
            </div>
          </div>
          <button onClick={onRestart} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors border border-slate-700 hover:border-emerald-500/50 px-4 py-2 rounded-lg">
            返回首页重置 Demo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center"><Server className="w-4 h-4 mr-2 text-blue-400" /> 模拟 B 端数据消费</h3>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">调用方 (API Caller)</p>
                  <p className="text-sm text-white font-mono flex items-center"><Hexagon className="w-4 h-4 mr-2 text-blue-500" /> Medical-LLM-Corp</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                  <p className="text-xs text-slate-500">账单金额</p>
                  <p className="text-lg font-bold text-white font-mono">8,425 <span className="text-xs text-emerald-500">CRD</span></p>
                </div>
              </div>
              <button 
                onClick={handleSimulatePayment} disabled={txStatus !== 'idle'}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 ${txStatus === 'idle' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : txStatus === 'processing' ? 'bg-slate-800 text-slate-400 cursor-wait' : 'bg-emerald-600/20 text-emerald-500 cursor-not-allowed'}`}
              >
                {txStatus === 'idle' && <><Zap className="w-5 h-5" /> <span>模拟付款并触发合约</span></>}
                {txStatus === 'processing' && <><Activity className="w-5 h-5 animate-spin" /> <span>合约清算中...</span></>}
                {txStatus === 'success' && <><CheckCircle className="w-5 h-5" /> <span>清算已完成</span></>}
              </button>
            </div>
            <div className="flex-1 bg-black/60 border border-slate-800 rounded-2xl p-5 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Contract Logs</h3>
              <div className="space-y-2">
                {logs.map((log, i) => <p key={i} className={`text-xs font-mono ${log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{log}</p>)}
                {txStatus === 'processing' && <p className="text-xs font-mono text-emerald-500/50 animate-pulse">_</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-8 relative flex flex-col items-center justify-center">
            <div className={`relative z-10 p-6 rounded-2xl border-2 flex flex-col items-center w-64 bg-slate-900 transition-all duration-700 ${txStatus !== 'idle' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-slate-700'}`}>
              <Database className={`w-10 h-10 mb-2 ${txStatus !== 'idle' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <p className="text-sm text-slate-400 mb-1">SmartSplit 资金池</p>
              <p className="text-2xl font-mono font-bold text-white">{txStatus === 'idle' ? '0.00' : '8,425.00'}</p>
            </div>
            <div className="h-24 w-full relative flex justify-center">
              <div className={`absolute top-0 w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 w-[70%] h-[2px] bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 left-[15%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 left-[50%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
              <div className={`absolute top-12 right-[15%] w-[2px] h-12 bg-slate-700 ${txStatus === 'success' ? 'bg-emerald-500' : ''}`}></div>
            </div>
            <div className="w-full flex justify-between px-4">
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-300 ${txStatus === 'success' ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <Wallet className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">内容创作者 (82.5%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>{txStatus === 'success' ? '+ 6,950.62' : '0.00'}</p>
              </div>
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-500 ${txStatus === 'success' ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <Activity className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-blue-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">平台运维节点 (10.5%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>{txStatus === 'success' ? '+ 884.62' : '0.00'}</p>
              </div>
              <div className={`w-[30%] flex flex-col items-center p-4 rounded-xl border transition-all duration-1000 delay-700 ${txStatus === 'success' ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <ShieldCheck className={`w-6 h-6 mb-2 ${txStatus === 'success' ? 'text-purple-400' : 'text-slate-600'}`} />
                <p className="text-xs text-slate-400 text-center mb-1">生态激励基金 (7.0%)</p>
                <p className={`text-lg font-mono font-bold ${txStatus === 'success' ? 'text-white' : 'text-slate-600'}`}>{txStatus === 'success' ? '+ 589.75' : '0.00'}</p>
              </div>
            </div>
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-all duration-700 ${txStatus === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
              <div className="border-4 border-emerald-500/20 text-emerald-500/20 rounded-full w-96 h-96 flex items-center justify-center -rotate-12"><span className="text-6xl font-black uppercase tracking-widest">Settled</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSplitScreen;