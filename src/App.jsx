import React, { useState } from 'react';
import DataInputScreen from './DataInputScreen';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="font-sans">
      {currentStep === 1 && (
        <DataInputScreen onComplete={() => setCurrentStep(2)} />
      )}
      {currentStep === 2 && (
        <div className="min-h-screen flex items-center justify-center bg-dark text-white text-2xl font-bold animate-pulse">
          确权成功！正在进入 AHP-熵权法 估值预言机... (准备做第二步)
        </div>
      )}
    </div>
  );
}

export default App;