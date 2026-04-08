import React, { useState } from 'react';
import DataInputScreen from './DataInputScreen';
import OracleValuationScreen from './OracleValuationScreen';
import SmartSplitScreen from './SmartSplitScreen';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assetData, setAssetData] = useState(""); // 新增：保存用户输入的数据

  const handleRestart = () => {
    setCurrentStep(1);
    setAssetData(""); // 重置时清空数据
  };

  return (
    <div className="font-sans antialiased text-slate-200 selection:bg-teal-500/30">
      
      {currentStep === 1 && (
        <DataInputScreen onComplete={(data) => {
          setAssetData(data); // 捕获第一页传出的数据
          setCurrentStep(2);
        }} />
      )}
      
      {currentStep === 2 && (
        // 把数据传给第二页
        <OracleValuationScreen assetData={assetData} onNext={() => setCurrentStep(3)} />
      )}

      {currentStep === 3 && (
        <SmartSplitScreen onRestart={handleRestart} />
      )}

    </div>
  );
}

export default App;