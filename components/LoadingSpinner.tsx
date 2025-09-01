
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
      <span className="text-text-secondary text-sm ml-2">BCA Genius is thinking...</span>
    </div>
  );
};

export default LoadingSpinner;