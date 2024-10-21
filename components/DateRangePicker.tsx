// components/DateRangePicker.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

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
        className="p-2 border rounded"
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => setEndDate(date)}
        selectsEnd
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        minDate={startDate || undefined}
        placeholderText="End Date"
        className="p-2 border rounded"
      />
    </div>
  );
};


export default DateRangePicker;
