import React, { useState, useEffect } from 'react';
import styles from './DatePicker.module.css';

const DatePicker = ({ value, onChange, id }) => {
  const getInitialDate = (dateString) => {
    if (dateString && dateString.includes('-')) {
      const parts = dateString.split('-');
      // Basic validation
      if (parts.length === 3) {
        return {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          day: parseInt(parts[2], 10),
        };
      }
    }
    return { year: '', month: '', day: '' };
  };

  const [date, setDate] = useState(getInitialDate(value));

  // Sync with parent component's value prop
  useEffect(() => {
    setDate(getInitialDate(value));
  }, [value]);

  const handleDateChange = (part, val) => {
    const newDate = { ...date, [part]: val ? parseInt(val, 10) : '' };
    setDate(newDate);

    if (newDate.year && newDate.month && newDate.day) {
      // Format to YYYY-MM-DD for consistency
      const formattedDate = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`;
      onChange(formattedDate);
    } else {
      onChange(''); // Send empty string if date is incomplete
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const daysInMonth = (year, month) => {
    if (!year || !month) return 31;
    // The '0' day of the next month gives the last day of the current month
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from({ length: daysInMonth(date.year, date.month) }, (_, i) => i + 1);

  return (
    <div className={styles.datePickerContainer} id={id}>
      <select
        value={date.day || ''}
        onChange={(e) => handleDateChange('day', e.target.value)}
        className={styles.dateSelect}
        required
      >
        <option value="" disabled>Ngày</option>
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={date.month || ''}
        onChange={(e) => handleDateChange('month', e.target.value)}
        className={styles.dateSelect}
        required
      >
        <option value="" disabled>Tháng</option>
        {months.map((m) => (
          <option key={m} value={m}>{`Tháng ${m}`}</option>
        ))}
      </select>
      <select
        value={date.year || ''}
        onChange={(e) => handleDateChange('year', e.target.value)}
        className={styles.dateSelect}
        required
      >
        <option value="" disabled>Năm</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default DatePicker; 