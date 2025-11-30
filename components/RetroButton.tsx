import React from 'react';

/**
 * Props for the RetroButton component.
 */
interface RetroButtonProps {
  /** The content to be rendered inside the button (e.g., text, icons). */
  children: React.ReactNode;
  /** Optional click handler function. */
  onClick?: () => void;
  /** Visual style variant of the button. Defaults to 'secondary'. */
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  /** Optional additional CSS classes to apply to the button. */
  className?: string;
  /** Indicates if the button is in an active/pressed state (styling only). Defaults to false. */
  isActive?: boolean;
  /** Indicates if the button is disabled. Defaults to false. */
  disabled?: boolean;
}

/**
 * A reusable button component with retro/neobrutalist styling.
 * Supports different variants (primary, secondary, accent, danger) and states (active, disabled).
 *
 * @param props - The properties for the component.
 * @returns A styled HTML button element.
 */
export const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  className = '',
  isActive = false,
  disabled = false,
}) => {
  const baseStyles = "font-mono font-bold uppercase tracking-wider transition-all duration-100 border-2 select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    primary: "bg-[#264653] text-[#FDF6E3] border-[#1a1a2e] shadow-neo hover:bg-[#2a9d8f]",
    secondary: "bg-[#F4A261] text-[#1a1a2e] border-[#5C4033] shadow-neo hover:bg-[#E76F51]",
    accent: "bg-[#FDF6E3] text-[#5C4033] border-[#5C4033] shadow-neo-sm hover:bg-white",
    danger: "bg-[#e94560] text-white border-[#5C4033] shadow-neo hover:bg-red-600",
  };

  const activeStyles = isActive ? "translate-x-[2px] translate-y-[2px] shadow-none bg-[#E76F51] text-[#1a1a2e]" : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none grayscale" : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${activeStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};
