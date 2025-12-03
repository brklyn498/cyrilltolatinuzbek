import React from 'react';

interface TextAreaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  accentColor?: 'orange' | 'teal';
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  readOnly,
  accentColor = 'orange'
}) => {
  const accentClass = accentColor === 'orange' ? 'bg-retro-orange' : 'bg-retro-teal';

  return (
    <div className="relative h-full flex flex-col">
      <div className={`absolute -bottom-2 -right-2 w-full h-full ${accentClass} border-2 border-black`}></div>
      <textarea
        className={`
          flex-grow
          w-full 
          h-[400px] md:h-[500px] 
          bg-retro-cream 
          text-retro-text 
          border-2 border-black 
          p-4 
          font-mono 
          text-sm md:text-base 
          resize-none 
          focus:outline-none 
          relative 
          z-10
          leading-relaxed
        `}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};