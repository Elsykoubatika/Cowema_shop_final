
import React from 'react';
import { OSInstructions } from './utils/osDetection';

interface InstallationStepsProps {
  instructions: OSInstructions;
}

const InstallationSteps: React.FC<InstallationStepsProps> = ({ instructions }) => {
  return (
    <div className="space-y-4">
      {instructions.steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{step.icon}</span>
              <p className="text-sm text-gray-800 font-medium">{step.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstallationSteps;
