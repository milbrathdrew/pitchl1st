// components/DateRangePicker.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define the props interface for the DateRangePicker component
interface DateRangePickerProps {
  startDate: Date | null;  // The selected start date
  endDate: Date | null;    // The selected end date
  setStartDate: (date: Date | null) => void;  // Function to update the start date
  setEndDate: (date: Date | null) => void;    // Function to update the end date
}

/**
 * DateRangePicker Component
 * 
 * This component renders two DatePicker inputs for selecting a date range.
 * It uses the react-datepicker library to create the date picker functionality.
 *
 * @param {Date | null} startDate - The currently selected start date
 * @param {Date | null} endDate - The currently selected end date
 * @param {Function} setStartDate - Function to update the start date
 * @param {Function} setEndDate - Function to update the end date
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="flex space-x-4 mb-4">
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        selectsStart
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        placeholderText="Start Date"
        className="custom-datepicker"
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => setEndDate(date)}
        selectsEnd
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        minDate={startDate || undefined}
        placeholderText="End Date"
        className="custom-datepicker"
      />
    </div>
  );
};

export default DateRangePicker;
