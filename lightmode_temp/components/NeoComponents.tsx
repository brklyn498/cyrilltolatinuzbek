import React from 'react';
import { ButtonProps } from '../types';

export const NeoButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative font-mono font-bold uppercase border-2 border-black transition-all duration-100 ease-in-out px-4 py-2 text-sm sm:text-xs md:text-sm shadow-neo active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";
  
  const variants = {
    primary: "bg-sam-dark text-white hover:bg-[#2A454E]",
    secondary: "bg-sam-accent text-black hover:bg-[#C89567]",
    accent: "bg-[#F0E6D2] text-black hover:bg-white",
    outline: "bg-transparent text-black hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const NeoPanel: React.FC<{ children: React.ReactNode; title?: string; className?: string }> = ({ 
  children, 
  title,
  className = '' 
}) => {
  return (
    <div className={`border-2 border-black bg-[#FDF6E3] shadow-neo p-1 flex flex-col h-full ${className}`}>
      {title && (
        <div className="border-b-2 border-black pb-2 mb-2 px-2 pt-1">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
      )}
      <div className="flex-1 p-2 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const NeoTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return (
    <textarea 
      className="w-full h-full p-4 font-mono text-sm sm:text-base bg-[#FFFDF5] border-2 border-black focus:outline-none focus:ring-0 focus:bg-white resize-none text-gray-800 placeholder-gray-400"
      spellCheck={false}
      {...props}
    />
  );
};

export const NeoSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  return (
    <div className="relative w-full border-2 border-black shadow-neo-sm bg-[#FFFDF5]">
      <select 
        className="w-full p-2 font-mono text-sm bg-transparent outline-none appearance-none cursor-pointer uppercase"
        {...props}
      >
        {props.children}
      </select>
      <div className="absolute right-0 top-0 bottom-0 flex items-center px-2 pointer-events-none border-l-2 border-black bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};