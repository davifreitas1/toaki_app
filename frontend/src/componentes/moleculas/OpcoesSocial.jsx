import React from 'react';

const OpcoesSocial = () => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {[1, 2, 3].map((item) => (
        <button 
            key={item} 
            className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            title="Login Social (Simulado)"
        />
      ))}
    </div>
  );
};

export default OpcoesSocial;