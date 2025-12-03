import React from 'react';
import { HistoryItem } from '../types';
import { RetroButton } from './RetroButton';

interface HistoryPanelProps {
    history: HistoryItem[];
    onRestore: (item: HistoryItem) => void;
    onClose: () => void;
    isOpen: boolean;
    theme: 'dark' | 'light';
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    history,
    onRestore,
    onClose,
    isOpen,
    theme,
}) => {
    const bgColor = theme === 'dark' ? 'bg-[#1e2336]' : 'bg-[#FDF6E3]';
    const borderColor = theme === 'dark' ? 'border-[#FDF6E3]' : 'border-[#5C4033]';
    const textColor = theme === 'dark' ? 'text-[#FDF6E3]' : 'text-[#5C4033]';
    const itemBgColor = theme === 'dark' ? 'bg-[#2a2f45]' : 'bg-white';
    const itemBorderColor = theme === 'dark' ? 'border-[#FDF6E3]/30' : 'border-[#5C4033]/30';

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 ${bgColor} border-l-4 ${borderColor} shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className={`p-4 border-b-2 ${borderColor} flex justify-between items-center`}>
                    <h2 className={`text-xl font-bold font-retro tracking-widest ${textColor}`}>
                        TARIX // HISTORY
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 hover:bg-red-500 hover:text-white transition-colors rounded-sm ${textColor}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className={`text-center opacity-50 mt-10 ${textColor}`}>
                            <p className="font-mono text-sm">Hozircha tarix bo'sh.</p>
                            <p className="font-mono text-xs mt-2">(No history yet)</p>
                        </div>
                    ) : (
                        history.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => onRestore(item)}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className={`p-3 border-2 ${itemBorderColor} ${itemBgColor} cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-sm transition-all group relative overflow-hidden animate-[slideIn_0.3s_ease-out_forwards] opacity-0`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-[#F4A261] text-[#1a1a2e]' : 'bg-[#5C4033] text-[#FDF6E3]'}`}>
                                        {item.mode}
                                    </span>
                                    <span className={`text-[10px] opacity-60 font-mono ${textColor}`}>
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className={`font-mono text-xs line-clamp-2 mb-1 opacity-80 ${textColor}`}>
                                    {item.original}
                                </p>
                                <div className={`w-full h-[1px] ${itemBorderColor} my-2`}></div>
                                <p className={`font-mono text-sm font-bold line-clamp-2 ${textColor}`}>
                                    {item.converted}
                                </p>

                                {/* Hover effect overlay */}
                                <div className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity`}></div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t-2 ${borderColor} bg-opacity-50`}>
                    <p className={`text-[10px] text-center opacity-60 ${textColor}`}>
                        Oxirgi 10 ta o'zgartirish saqlanadi
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </>
    );
};
