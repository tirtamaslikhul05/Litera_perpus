import React from 'react';

export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  onClick 
}) {
  const baseStyle = "w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#003366] text-white hover:bg-blue-950 shadow-sm",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
    warning: "bg-[#fbc02d] text-slate-900 hover:bg-yellow-500 font-bold"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}