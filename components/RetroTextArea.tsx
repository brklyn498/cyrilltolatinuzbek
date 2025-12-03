import React from 'react';
import { Theme } from '../types';

interface RetroTextAreaProps {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    accentColor?: 'orange' | 'teal';
    theme?: Theme;
}

export const RetroTextArea: React.FC<RetroTextAreaProps> = ({
    value,
    onChange,
    placeholder,
    readOnly,
    accentColor = 'orange',
    theme = 'dark'
}) => {
    // Determine accent class based on theme and color prop
    const getAccentClass = () => {
        if (theme === 'light') {
            return accentColor === 'orange' ? 'bg-[#F4A261]' : 'bg-[#2A9D8F]';
        }
        // Dark mode (Retro)
        return accentColor === 'orange' ? 'bg-retro-orange' : 'bg-retro-teal';
    };

    const accentClass = getAccentClass();

    // Base styles for the textarea itself
    const textAreaBaseStyles = "flex-grow w-full h-[300px] lg:h-[500px] border-2 p-4 font-mono text-sm md:text-base resize-none focus:outline-none relative z-10 leading-relaxed transition-colors duration-300";

    const textAreaThemeStyles = theme === 'light'
        ? "bg-white text-black border-black placeholder-gray-400"
        : "bg-retro-cream text-retro-text border-black placeholder-gray-500";

    return (
        <div className="relative h-full flex flex-col group">
            {/* Offset Background Accent */}
            <div className={`absolute -bottom-2 -right-2 w-full h-full ${accentClass} border-2 border-black transition-colors duration-300`}></div>

            <textarea
                className={`${textAreaBaseStyles} ${textAreaThemeStyles}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                spellCheck={false}
            />
        </div>
    );
};
