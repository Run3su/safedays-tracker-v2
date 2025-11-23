import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-brand-100/50 dark:border-gray-700 ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
  const baseStyles = "px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200 dark:shadow-none",
    outline: "border-2 border-brand-200 text-brand-700 hover:bg-brand-50 bg-transparent dark:border-brand-800 dark:text-brand-300 dark:hover:bg-gray-800",
    ghost: "text-brand-600 hover:bg-brand-50 bg-transparent dark:text-brand-400 dark:hover:bg-gray-800",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color: 'red' | 'yellow' | 'green' | 'blue' | 'pink' }> = ({ children, color }) => {
  const styles = {
    red: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800/50",
    yellow: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800/50",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800/50",
    blue: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-800/50",
    pink: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-800/50",
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[color]}`}>
      {children}
    </span>
  );
};

// --- Select (Simple Implementation) ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <div className="relative">
      <select 
        className={`w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

// --- Header ---
export const Header: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="mb-6 flex justify-between items-start">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-xl animate-fade-in-down overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};