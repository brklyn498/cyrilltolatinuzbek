import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
    label: string;
    value: string;
}

interface RetroDropdownProps {
    label?: string;
    options: DropdownOption[];
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export const RetroDropdown: React.FC<RetroDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    className = '',
    placeholder = 'Select an option',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-bold tracking-widest text-[#F4A261] uppercase mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={toggleDropdown}
                className={`w-full bg-[#FDF6E3] text-[#5C4033] border-2 border-[#5C4033] shadow-neo-sm hover:bg-white font-mono font-bold uppercase tracking-wider py-2 px-4 flex items-center justify-between transition-all duration-100 ${isOpen ? 'translate-x-[2px] translate-y-[2px] shadow-none' : ''
                    }`}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <div
                    className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#5C4033] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                ></div>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#FDF6E3] border-2 border-[#5C4033] shadow-neo max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`w-full text-left px-4 py-2 font-mono font-bold uppercase tracking-wider hover:bg-[#F4A261] hover:text-[#1a1a2e] transition-colors duration-75 ${value === option.value ? 'bg-[#F4A261] text-[#1a1a2e]' : 'text-[#5C4033]'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
