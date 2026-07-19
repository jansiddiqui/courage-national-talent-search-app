"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  hasError?: boolean;
}

export default function CustomDatePicker({
  value,
  onChange,
  onBlur,
  className = "",
  disabled = false,
  id,
  placeholder = "DD/MM/YYYY",
  hasError = false,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input value with parent value
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-");
      const expected = `${d}/${m}/${y}`;
      if (inputValue !== expected) {
        setInputValue(expected);
      }
    } else if (!value) {
      // Only clear if the input is not currently focused (meaning it was reset by the parent form)
      if (containerRef.current && document.activeElement !== containerRef.current.querySelector("input")) {
        setInputValue("");
      }
    }
  }, [value]);

  // Calendar view state (displays this month/year)
  const [viewDate, setViewDate] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value);
    }
    return new Date();
  });

  // Sync calendar view if selected value changes
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setViewDate(new Date(value));
    }
  }, [value]);

  // Click outside to close calendar popover and trigger onBlur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        
        let resolved = "";
        if (inputValue.length === 10) {
          const [dStr, mStr, yStr] = inputValue.split("/");
          const d = parseInt(dStr, 10);
          const m = parseInt(mStr, 10);
          const y = parseInt(yStr, 10);
          if (y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
            resolved = `${y}-${mStr.padStart(2, "0")}-${dStr.padStart(2, "0")}`;
          }
        }
        
        if (onBlur) onBlur(resolved);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur, inputValue]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-11

  // Handle typing with DD/MM/YYYY masking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value.replace(/\D/g, ""); // strip non-digits
    if (text.length > 8) text = text.slice(0, 8);

    // Apply DD/MM/YYYY mask
    let formatted = "";
    if (text.length > 0) {
      formatted += text.slice(0, 2);
    }
    if (text.length > 2) {
      formatted += "/" + text.slice(2, 4);
    }
    if (text.length > 4) {
      formatted += "/" + text.slice(4, 8);
    }

    setInputValue(formatted);

    // If fully filled (10 chars e.g. DD/MM/YYYY), validate and notify parent
    if (formatted.length === 10) {
      const [dStr, mStr, yStr] = formatted.split("/");
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);

      // Validate basic ranges
      if (y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const iso = `${y}-${mStr}-${dStr}`;
        onChange(iso);
        setViewDate(new Date(y, m - 1, d));
      }
    } else if (formatted.length === 0) {
      onChange("");
    }
  };

  const handleInputBlur = () => {
    let resolved = "";
    if (inputValue.length === 10) {
      const [dStr, mStr, yStr] = inputValue.split("/");
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);
      if (y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        resolved = `${y}-${mStr.padStart(2, "0")}-${dStr.padStart(2, "0")}`;
      }
    }

    // Clear incomplete input on blur
    if (inputValue.length > 0 && inputValue.length < 10) {
      onChange("");
      setInputValue("");
      resolved = "";
    }

    if (onBlur) onBlur(resolved);
  };

  const handleDaySelect = (day: number) => {
    const dStr = day.toString().padStart(2, "0");
    const mStr = (viewMonth + 1).toString().padStart(2, "0");
    const yStr = viewYear.toString();
    const iso = `${yStr}-${mStr}-${dStr}`;
    onChange(iso);
    setIsOpen(false);
    if (onBlur) onBlur(iso);
  };

  const navigateMonth = (direction: number) => {
    setViewDate(new Date(viewYear, viewMonth + direction, 1));
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewMonth, 1));
  };

  const handleMonthChange = (month: number) => {
    setViewDate(new Date(viewYear, month, 1));
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysGrid: (number | null)[] = [];
  // Fill empty spaces for offset
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  // Fill month days
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  // Years option range (candidate birth years from 2000 to 2025)
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Parse active selected day to highlight in UI
  let selectedDay: number | null = null;
  let selectedMonth: number | null = null;
  let selectedYear: number | null = null;
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split("-");
    selectedYear = parseInt(parts[0], 10);
    selectedMonth = parseInt(parts[1], 10) - 1;
    selectedDay = parseInt(parts[2], 10);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper */}
      <div className="relative flex items-center">
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} pr-10`}
          maxLength={10}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <CalendarIcon size={16} />
        </button>
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-auto sm:w-72 mt-2 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 animate-fadeIn">
          {/* Header Month/Year Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1 flex-1 justify-center">
              {/* Month Select */}
              <select
                value={viewMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-150 rounded-lg py-1 px-1.5 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Select */}
              <select
                value={viewYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-150 rounded-lg py-1 px-1.5 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          {/* Calendar Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }

              const isSelected =
                selectedDay === day &&
                selectedMonth === viewMonth &&
                selectedYear === viewYear;

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === viewMonth &&
                new Date().getFullYear() === viewYear;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-800 text-white shadow shadow-blue-800/10"
                      : isToday
                      ? "bg-slate-100 text-blue-800 font-bold border border-blue-100"
                      : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
