import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  id?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  allowManualEntry?: boolean;
  className?: string;
  error?: boolean;
}

export default function SearchableSelect({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select...",
  disabled = false,
  allowManualEntry = false,
  className = "",
  error = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  // Find selected label to display when closed
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = isOpen ? searchQuery : (selectedOption ? selectedOption.label : (allowManualEntry && value ? value : ""));

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleManualEntry = () => {
    if (searchQuery.trim()) {
      onChange(searchQuery.trim());
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`w-full px-4 py-3 pr-16 rounded-xl border bg-slate-50/50 text-sm transition-all duration-200 cursor-text flex items-center min-h-[46px]
          ${disabled ? "opacity-60 cursor-not-allowed" : ""} 
          ${error ? "border-red-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-blue-800 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-800/10"}
          ${className}
        `}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            if (!isOpen) {
               setSearchQuery(""); 
            }
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
      >
        {isOpen ? (
          <div className="flex items-center w-full gap-2">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              id={id}
              type="text"
              className="w-full bg-transparent outline-none text-slate-800"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={disabled}
            />
          </div>
        ) : (
          <div className={`w-full truncate ${!displayValue ? "text-slate-400" : "text-slate-800"}`}>
            {displayValue || placeholder}
          </div>
        )}
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-transparent">
          {value && !disabled && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearchQuery("");
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 z-10"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-slide-up origin-top">
          {filteredOptions.length > 0 ? (
            <ul className="py-2">
              {filteredOptions.map((opt) => (
                <li 
                  key={opt.value}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    opt.value === value 
                      ? "bg-blue-50 text-blue-800 font-medium" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center">
              No results found.
              {allowManualEntry && searchQuery.trim() && (
                <button
                  type="button"
                  onClick={handleManualEntry}
                  className="mt-3 w-full py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  Use &quot;{searchQuery}&quot; manually
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
