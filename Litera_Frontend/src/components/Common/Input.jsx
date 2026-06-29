import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  disabled = false,
  error = '',
  rightElement = null
}) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 ${
            error 
              ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' 
              : 'border-slate-200 focus:ring-blue-500/10 focus:border-[#003366]'
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 animate-fadeIn pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}