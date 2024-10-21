// components/ExportButton.tsx
import React from 'react';

interface ExportButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Export Emails to CSV
    </button>
  );
};

export default ExportButton;
