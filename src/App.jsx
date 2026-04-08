import React, { useState } from 'react';
import DataInputScreen from './DataInputScreen';
import OracleValuationScreen from './OracleValuationScreen';
import SmartSplitScreen from './SmartSplitScreen';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assetData, setAssetData] = useState(""); 
  const [isZkMode, setIsZkMode] = useState(true);

  const handleRestart = () => {
    setCurrentStep(1);
    setAssetData(""); 
  };

  return (
    <div className="font-sans antialiased text-slate-200 selection:bg-teal-500/30">
      {currentStep === 1 && (
        <DataInputScreen onComplete={(data, zkEnabled) => {
          setAssetData(data); 
          setIsZkMode(zkEnabled);
          setCurrentStep(2);
        }} />
      )}
      
      {currentStep === 2 && (
        <OracleValuationScreen assetData={assetData} isZkMode={isZkMode} onNext={() => setCurrentStep(3)} />
      )}

      {currentStep === 3 && (
        <SmartSplitScreen onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;