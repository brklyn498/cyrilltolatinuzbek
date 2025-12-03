import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'action';
  isActive?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'secondary', 
  isActive = false, 
  className = '',
  fullWidth = false
}) => {
  const baseStyles = "font-mono font-bold text-xs md:text-sm border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase py-2 px-3 tracking-wider truncate";
  
  let variantStyles = "";
  
  switch (variant) {
    case 'primary':
      // The Big "O'ZGARTIRISH" button style
      variantStyles = "bg-[#1A3C40] text-white shadow-neo hover:bg-[#235359]";
      break;
    case 'accent':
      // Orange/Teal buttons
      variantStyles = "bg-retro-orange text-black shadow-neo hover:bg-[#F4A261]";
      break;
    case 'action':
      // Yellowish action buttons
      variantStyles = "bg-[#E9C46A] text-black shadow-neo hover:bg-[#F4E4A9]";
      break;
    case 'secondary':
    default:
      // Beige filter buttons
      if (isActive) {
         variantStyles = "bg-retro-cream text-black shadow-none translate-x-[2px] translate-y-[2px] border-retro-orange";
      } else {
         variantStyles = "bg-retro-beige text-black shadow-neo hover:bg-white";
      }
      break;
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {label}
    </button>
  );
};