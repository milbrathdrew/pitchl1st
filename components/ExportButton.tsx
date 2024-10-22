// components/ExportButton.tsx
import React from 'react';

// Define the props interface for the ExportButton component
interface ExportButtonProps {
  onClick: () => void;  // Function to be called when the button is clicked
  disabled: boolean;    // Boolean to determine if the button should be disabled
}

/**
 * ExportButton Component
 * 
 * This component renders a button that triggers an export action, typically exporting emails to a CSV file.
 * The button's appearance and behavior change based on its disabled state.
 *
 * @param {Function} onClick - The function to be executed when the button is clicked
 * @param {boolean} disabled - Determines whether the button should be disabled or not
 */
const ExportButton: React.FC<ExportButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}  // Attach the onClick handler
      disabled={disabled}  // Set the disabled state
      className="btn-primary" //Style the button using globals.css class
    >
      Generate Pitchl1st (CSV)
    </button>
  );
};

// Export the ExportButton component as the default export
export default ExportButton;