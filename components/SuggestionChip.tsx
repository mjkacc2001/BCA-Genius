
import React from 'react';

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm text-blue-200 bg-primary/20 border border-primary/50 rounded-full hover:bg-primary/40 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {text}
    </button>
  );
};

export default SuggestionChip;