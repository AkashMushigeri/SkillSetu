'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, GraduationCap, MapPin, Check, AlertCircle, X, ChevronDown } from 'lucide-react';
import { CollegeItem, searchColleges } from '@/data/collegesData';

interface CollegeAutocompleteProps {
  value: string;
  selectedCollege: CollegeItem | null;
  onChange: (collegeName: string, college: CollegeItem | null) => void;
  error?: string | null;
  required?: boolean;
}

export const CollegeAutocomplete: React.FC<CollegeAutocompleteProps> = ({
  value,
  selectedCollege,
  onChange,
  error,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Dynamic filtered list based on typed value
  const results = searchColleges(value, 8);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Scroll highlighted item into view if navigating with keyboard
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (college: CollegeItem) => {
    onChange(college.name, college);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const clean = query.trim().toLowerCase();
    // Check if the query matches an institution in the trusted dataset
    const matched = searchColleges(query, 1)[0];
    const isExact =
      matched &&
      (matched.name.toLowerCase() === clean ||
        (matched.shortName && matched.shortName.toLowerCase() === clean) ||
        (matched.aliases && matched.aliases.some((a) => a.toLowerCase() === clean)));

    onChange(query, isExact ? matched : null);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (results.length > 0 ? (prev <= 0 ? results.length - 1 : prev - 1) : -1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        e.preventDefault();
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Helper to highlight matching substrings in text
  const renderHighlighted = (text: string, query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return text;

    const idx = text.toLowerCase().indexOf(q);
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + q.length);
      const after = text.slice(idx + q.length);
      return (
        <>
          {before}
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded-xs px-0.5">
            {match}
          </span>
          {after}
        </>
      );
    }

    const words = q.split(' ').filter((w) => w.length > 2);
    for (const word of words) {
      const wIdx = text.toLowerCase().indexOf(word);
      if (wIdx !== -1) {
        const before = text.slice(0, wIdx);
        const match = text.slice(wIdx, wIdx + word.length);
        const after = text.slice(wIdx + word.length);
        return (
          <>
            {before}
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded-xs px-0.5">
              {match}
            </span>
            {after}
          </>
        );
      }
    }

    return text;
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', null);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          College / University Name {required && <span className="text-emerald-600 dark:text-emerald-400">*</span>}
        </label>
        {selectedCollege && selectedCollege.isVerified !== false && (
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Verified Institution
          </span>
        )}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          required={required}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by college name, short code (e.g. GAT, RVCE), or city..."
          autoComplete="off"
          className={`w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800/90 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-sans ${
            error
              ? 'border-red-500/80 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500'
          }`}
        />

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Clear college search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <ChevronDown
            className={`w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {/* Autocomplete Dropdown Listbox */}
      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          aria-label="College suggestions"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/60 z-50 overflow-hidden backdrop-blur-xl max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isHighlighted = idx === highlightedIndex;
              const isSelected = selectedCollege?.id === item.id || value.trim().toLowerCase() === item.name.toLowerCase();

              return (
                <button
                  key={item.id}
                  role="option"
                  aria-selected={isHighlighted || isSelected}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors ${
                    isHighlighted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                      : isSelected
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate flex items-center gap-1.5">
                        <span className="truncate">{renderHighlighted(item.name, value)}</span>
                        {item.shortName && (
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 shrink-0">
                            ({item.shortName})
                          </span>
                        )}
                      </div>
                      {item.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 px-1.5 py-0.5 rounded-md shrink-0">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                      <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {item.city}, {item.state}
                      </span>
                      {item.university && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-500 dark:text-slate-400 truncate">
                            {item.university}
                          </span>
                        </>
                      )}
                      {!item.university && item.affiliation && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-500 dark:text-slate-400 truncate">
                            {item.affiliation}
                          </span>
                        </>
                      )}
                      {item.institutionType && (
                        <>
                          <span>&bull;</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {item.institutionType}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                No matching college found. Try another name.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Tip: Search by college name, city (e.g. Bengaluru, Mysuru, Hubballi), or short code (e.g. RVCE, BMSCE).
              </p>
            </div>
          )}
        </div>
      )}

      {error ? (
        <p className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
          Select your verified college or university from the verified network
        </p>
      )}
    </div>
  );
};
