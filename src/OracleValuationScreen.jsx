import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, ShieldCheck, FileText, Calculator, Network, CheckCircle2 } from 'lucide-react';

const OracleValuationScreen = ({ onNext }) => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [calcStep, setCalcStep] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [valuationResult, setValuationResult] = useState(null); // 存储后端返回的真实数据

  // 初始全0数据（用于动画过渡）
  const initialData = [
    { subject: '领域专业度 (AHP)', score: 0, fullMark: 100 },
    { subject: '语料清洁度 (AHP)', score: 0, fullMark: 100 },
    { subject: '逻辑连贯性 (AHP)', score: 0, fullMark: 100 },
    { subject: '全网稀缺度 (熵权)', score: 0, fullMark: 100 },
    { subject: '预计调用频次 (熵权)', score: 0, fullMark: 100 },
    { subject: '节点履约信用', score: 0, fullMark: 100 },
  ];

  useEffect(() => {
    setChartData(initialData);

    // 步骤动画模拟
    const steps = [
      '正在接入 RAG 知识库检索全网重合度...',
      '触发 AHP 层次分析，计算主观质量权重...',
      '提取链上参数，计算熵权法客观离散度...',
      '执行 W_i = α*W_ahp + β*W_entropy 权重融合...',
      '向 Python 算法引擎发起 RPC 调用...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setCalcStep(current);
        current++;
      }
    }, 800);

    // 核心：真实呼叫你的 Python 后端！
    const fetchRealValuation = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/valuate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset_type: "自定义输入语料",
            description: assetData || "未输入内容", // 这里使用了第一页传过来的真实文本！
            author_id: "Node-7A9B"
          })
        });
        
        const realData = await response.json();
        
        setTimeout(() => {
          clearInterval(interval);
          setValuationResult(realData);
          setChartData(realData.metrics);
          setIsCalculating(false);
        }, 4000); 

      } catch (error) {
        console.error("后端连接失败:", error);
        clearInterval(interval);
      }
    };

    fetchRealValuation();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden p-6 font-sans">
      {/* 赛博朋克环境光 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-6xl w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col h-[85vh]">
        
        {/* 头部标题区域 */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl animate-pulse">
              <Network className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                双源交叉验证预言机 (Oracle)
              </h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center">
                <Calculator className="w-4 h-4 mr-1 text-emerald-500" /> API: Live | Python Engine Active
              </p>
            </div>
          </div>
          
          {/* 状态徽章 */}
          <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center transition-all duration-500 ${isCalculating ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {isCalculating ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            {isCalculating ? 'Consensus Computing...' : 'Valuation Complete'}
          </div>
        </div>

        {/* 核心双栏展示区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 overflow-hidden">
          
          {/* 左侧：动态雷达图 */}
          <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 flex flex-col relative group">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-teal-500" />
              多维要素价值映射谱图
            </h3>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#0d9488', borderRadius: '8px' }} itemStyle={{ color: '#2dd4bf' }} />
                  <Radar name="资产价值系数" dataKey="score" stroke="#14b8a6" strokeWidth={2} fill="#0d9488" fillOpacity={isCalculating ? 0.1 : 0.4} className="transition-all duration-1000 ease-out" />
                </RadarChart>
              </ResponsiveContainer>
              
              {isCalculating && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent bg-[length:100%_200%] animate-[scan_2s_linear_infinite] pointer-events-none rounded-xl"></div>
              )}
            </div>
          </div>

          {/* 右侧：计算日志 & 最终估值报告 */}
          <div className="flex flex-col space-y-6">
            
            {/* 演算黑盒日志 */}
            <div className="bg-[#0a0f18] rounded-2xl border border-slate-800 p-6 h-48 overflow-hidden relative">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-2">
                Oracle Execution Log
              </h3>
              <div className="space-y-3">
                {[
                  '正在接入 RAG 知识库检索全网重合度...',
                  '触发 AHP 层次分析，计算主观质量权重...',
                  '提取链上参数，计算熵权法客观离散度...',
                  '执行 W_i = α*W_ahp + β*W_entropy 权重融合...',
                  '接收 Python 引擎计算结果...'
                ].map((step, index) => (
                  <div key={index} className={`font-mono text-sm transition-all duration-300 ${index === calcStep ? 'text-teal-400 animate-pulse font-bold' : index < calcStep ? 'text-slate-500' : 'opacity-0'}`}>
                    {index < calcStep ? '[DONE] ' : '>> '} {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 资产估值可信报告卡片 (计算完毕后显现) */}
            <div className={`flex-1 bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-700 transform ${isCalculating ? 'translate-y-10 opacity-0 blur-sm' : 'translate-y-0 opacity-100 blur-none'}`}>
              
              <ShieldCheck className="absolute -bottom-6 -right-6 w-48 h-48 text-teal-900/20 rotate-12" />
              
              <div className="flex justify-between items-start mb-6 border-b border-teal-500/20 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-teal-400" /> 数据资产可信估值凭证
                  </h2>
                  <p className="text-xs text-teal-500/70 font-mono mt-1">ISSUER: AI-ECHO ORACLE NETWORK</p>
                  <p className="text-xs text-slate-500 font-mono truncate w-48 mt-1">Hash: {valuationResult?.asset_hash}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
                    {valuationResult?.final_valuation.base_value > 8000 ? 'S' : valuationResult?.final_valuation.base_value > 6000 ? 'A+' : 'A'}
                  </div>
                  <p className="text-xs text-slate-400 uppercase">资产综合评级</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase mb-1">动态价值基准 (Base Value)</p>
                  <p className="text-2xl font-mono text-white">{valuationResult?.final_valuation.base_value.toLocaleString()} <span className="text-sm text-teal-500">Credits</span></p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase mb-1">建议创作者分账比例</p>
                  <p className="text-2xl font-bold text-emerald-400">{valuationResult?.final_valuation.creator_ratio} <span className="text-sm">%</span></p>
                </div>
              </div>

              <button 
                onClick={onNext}
                className="w-full py-4 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/50 rounded-xl text-teal-300 font-bold transition-all flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] relative z-10"
              >
                授权 API 调用并进入智能分账协议 <Activity className="w-4 h-4 ml-2" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleValuationScreen;