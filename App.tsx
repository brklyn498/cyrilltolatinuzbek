import React, { useState, useEffect } from 'react';
import { ConversionMode } from './types';
import { convertText } from './utils/converter';
import { RetroButton } from './components/RetroButton';

const SAMPLE_TEXT = `Ўзбекистон - келажаги буюк давлат.`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);
  const [outputText, setOutputText] = useState<string>('');
  // Mode is now fixed/defaulted to Cyrillic to Latin, but we keep state structure if we expand later
  const [currentMode, setCurrentMode] = useState<ConversionMode>(ConversionMode.CYRILLIC_TO_LATIN);
  const [isCopied, setIsCopied] = useState(false);

  const handleConvert = () => {
    const result = convertText(inputText, currentMode);
    setOutputText(result);
  };

  // Initial conversion and reactive updates
  useEffect(() => {
    handleConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, currentMode]); // Added inputText to dependency to auto-convert on typing

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('Brauzeringiz clipboard-ga ruxsat bermadi (Clipboard permission denied).');
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'uzbek-latin-converted.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1A1A2E] via-[#4A2C40] to-[#E76F51] text-[#FDF6E3] font-mono p-4 md:p-8 flex flex-col items-center">

      {/* Main Container Frame */}
      <div className="w-full max-w-7xl border-4 border-[#FDF6E3] p-4 md:p-6 relative bg-white/5 backdrop-blur-sm shadow-2xl rounded-sm">

        {/* Decorative Corner Lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FDF6E3] -mt-1 -ml-1"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FDF6E3] -mt-1 -mr-1"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FDF6E3] -mb-1 -ml-1"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FDF6E3] -mb-1 -mr-1"></div>

        {/* Header */}
        <header className="flex justify-center mb-8 md:mb-12 relative">
           <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-[#FDF6E3] -z-10"></div>
           <div className="bg-[#1e2336] px-6 py-2 border-2 border-[#FDF6E3] shadow-neo transform -rotate-1 z-10">
              <h1 className="text-xl md:text-3xl font-bold tracking-[0.2em] text-[#F4A261] drop-shadow-md font-retro">
                MATN KONVERTORI // SAMARKAND-V1.0
              </h1>
           </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-sm md:text-base font-bold tracking-widest text-[#FDF6E3]/80 uppercase mb-1">
              Kirish Matni (Kirill)
            </h2>
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-[#F4A261] translate-x-2 translate-y-2 rounded-sm"></div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="relative w-full h-[300px] lg:h-[500px] bg-[#FDF6E3] text-[#1a1a2e] p-4 font-mono text-sm md:text-base border-2 border-[#5C4033] outline-none focus:border-[#e76f51] resize-none shadow-inner-retro leading-relaxed"
                placeholder="// Matnni shu yerga kiriting..."
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
              <RetroButton
                onClick={handleClear}
                variant="secondary"
                className="flex-1 text-xs md:text-sm py-2 bg-[#d4a373]"
              >
                TOZALASH
              </RetroButton>
              <RetroButton
                onClick={handlePaste}
                variant="secondary"
                className="flex-1 text-xs md:text-sm py-2 bg-[#d4a373]"
              >
                XOTIRADAN QO'YISH
              </RetroButton>
            </div>
          </div>

          {/* Middle Column: Controls (Simplified) */}
          <div className="lg:col-span-2 flex flex-col justify-center items-center gap-6 relative py-4 lg:py-0">
             {/* Decorative vertical line for desktop */}
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 left-0 top-0"></div>
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 right-0 top-0"></div>

            {/* Arrow Decoration */}
            <div className="hidden lg:flex flex-col items-center opacity-50">
                <span className="text-4xl text-[#F4A261] animate-pulse">➔</span>
            </div>

            <div className="lg:hidden flex justify-center opacity-50 my-2">
                <span className="text-4xl text-[#F4A261] rotate-90 animate-pulse">➔</span>
            </div>

            {/* Manual Convert Button (though it's reactive now, good for emphasis) */}
             <div className="w-full flex justify-center">
                <RetroButton
                  onClick={handleConvert}
                  variant="primary"
                  className="w-full lg:w-auto px-6 py-4 text-lg bg-[#264653] text-white hover:bg-[#2A9D8F] tracking-widest shadow-neo"
                >
                  O'GIRISH
                </RetroButton>
              </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-sm md:text-base font-bold tracking-widest text-[#FDF6E3]/80 uppercase mb-1">
              Chiqish Matni (Lotin)
            </h2>
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-[#2A9D8F] translate-x-2 translate-y-2 rounded-sm"></div>
              <textarea
                value={outputText}
                readOnly
                className="relative w-full h-[300px] lg:h-[500px] bg-[#FDF6E3] text-[#1a1a2e] p-4 font-mono text-sm md:text-base border-2 border-[#5C4033] outline-none resize-none shadow-inner-retro leading-relaxed"
                placeholder="// Natija..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
              <RetroButton
                onClick={handleDownload}
                variant="secondary"
                className="flex-1 text-xs md:text-sm py-2 bg-[#e9c46a]"
              >
                YUKLASH (.TXT)
              </RetroButton>
              <RetroButton
                onClick={handleCopy}
                variant="secondary"
                className="flex-1 text-xs md:text-sm py-2 bg-[#e9c46a]"
              >
                {isCopied ? 'NUSXALANDI!' : 'NUSXALASH'}
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center border-t border-[#FDF6E3]/30 pt-4">
          <p className="text-[10px] md:text-xs font-mono text-[#FDF6E3]/60 tracking-widest uppercase">
            UZBEK DIGITAL HERITAGE LAB // SAMARKAND-V1.0
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;