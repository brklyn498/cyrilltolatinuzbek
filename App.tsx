import React, { useState, useEffect, useRef } from 'react';
import { ConversionMode } from './types';
import { convertText } from './utils/converter';
import { generatePdf } from './utils/pdfGenerator';
import { RetroButton } from './components/RetroButton';

// Initial sample text in Uzbek Cyrillic to demonstrate the feature
const SAMPLE_CODE = `Ўзбекистон Республикаси Марказий Осиёнинг марказида жойлашган давлатдир.
Пойтахти - Тошкент шаҳри.
Давлат тили - ўзбек тили.
Бу матн лотин алифбосига автоматик равишда ўгирилади.`;

/**
 * The main application component for the Samarkand Text Converter.
 * Manages the state for input text, output text, conversion mode, and UI interactions.
 * Renders the layout including input area, control panel, and output area.
 *
 * @returns The rendered React component.
 */
const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_CODE);
  const [outputText, setOutputText] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<ConversionMode>(ConversionMode.CYRILLIC_TO_LATIN);
  const [isCopied, setIsCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the text conversion process based on the current mode and input text.
   * Updates the outputText state with the result.
   */
  const handleConvert = () => {
    const result = convertText(inputText, currentMode);
    setOutputText(result);
  };

  // Initial conversion and when input/mode changes
  useEffect(() => {
    handleConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, currentMode]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
            setShowDownloadMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Clears the input and output text areas and sets focus back to the input.
   */
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    inputRef.current?.focus();
  };

  /**
   * Pastes text from the system clipboard into the input area.
   * Handles permission errors or failures gracefully.
   */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('Brauzeringiz clipboard-ga ruxsat bermadi (Clipboard permission denied).');
    }
  };

  /**
   * Copies the converted output text to the system clipboard.
   * Shows a temporary 'Copied' state on the button.
   */
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  /**
   * Triggers the download of the output text as a .txt file.
   */
  const handleDownloadTxt = () => {
    if (!outputText) return;
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'converted_samarkand.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  /**
   * Triggers the generation and download of the output text as a PDF file.
   */
  const handleDownloadPdf = () => {
    if (!outputText) return;
    generatePdf(outputText);
    setShowDownloadMenu(false);
  };

  /**
   * Toggles the visibility of the download dropdown menu.
   */
  const toggleDownloadMenu = () => {
    if (!outputText) return;
    setShowDownloadMenu(!showDownloadMenu);
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
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className="text-sm md:text-base font-bold tracking-widest text-[#FDF6E3]/80 uppercase mb-1">
              Kirish Matni (Asl)
            </h2>
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-[#F4A261] translate-x-2 translate-y-2 rounded-sm"></div>
              <textarea
                ref={inputRef}
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
                Kirishni Tozalash
              </RetroButton>
              <RetroButton 
                onClick={handlePaste} 
                variant="secondary" 
                className="flex-1 text-xs md:text-sm py-2 bg-[#d4a373]"
              >
                Xotiradan Joylashtirish
              </RetroButton>
            </div>
          </div>

          {/* Middle Column: Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center gap-6 relative py-4 lg:py-0">
             {/* Decorative vertical line for desktop */}
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 left-0 top-0"></div>
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 right-0 top-0"></div>

            <div className="w-full max-w-sm border-2 border-[#FDF6E3]/50 bg-[#1a1a2e]/60 backdrop-blur-md p-6 rounded-sm shadow-neo">
              
              <div className="mb-4 text-center">
                <label className="text-xs font-bold tracking-widest text-[#F4A261] uppercase">Conversion Mode</label>
                <div className="mt-2 w-full bg-[#FDF6E3] border-2 border-[#5C4033] p-2 flex items-center justify-between cursor-default shadow-neo-sm">
                  <span className="text-[#1a1a2e] font-bold truncate pr-2">{currentMode}</span>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#5C4033]"></div>
                </div>
              </div>

              {/* Mode Buttons Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <RetroButton
                    variant="accent"
                    isActive={currentMode === ConversionMode.CYRILLIC_TO_LATIN}
                    onClick={() => setCurrentMode(ConversionMode.CYRILLIC_TO_LATIN)}
                    className="col-span-2 text-sm py-3 bg-[#F4A261] border-[#5C4033] font-bold"
                  >
                    CYRILLIC -&gt; LATIN
                  </RetroButton>

                {[
                  ConversionMode.LOWERCASE,
                  ConversionMode.TITLE_CASE,
                  ConversionMode.SENTENCE_CASE,
                  ConversionMode.REVERSE,
                  ConversionMode.BINARY,
                  ConversionMode.HEX,
                  ConversionMode.BASE64
                ].map((mode) => (
                  <RetroButton
                    key={mode}
                    variant="accent"
                    isActive={currentMode === mode}
                    onClick={() => setCurrentMode(mode)}
                    className={`text-xs md:text-xs py-2 ${mode === ConversionMode.SENTENCE_CASE ? 'col-span-2' : ''}`}
                  >
                    {mode === ConversionMode.LOWERCASE ? 'KICHIK HARF' : 
                     mode === ConversionMode.TITLE_CASE ? 'SARLAVHA HARFI' :
                     mode === ConversionMode.SENTENCE_CASE ? 'GAP BOSHI HARFI' :
                     mode}
                  </RetroButton>
                ))}
                
                 <RetroButton
                    variant="accent"
                    isActive={currentMode === ConversionMode.UPPERCASE}
                    onClick={() => setCurrentMode(ConversionMode.UPPERCASE)}
                    className="col-span-2 mt-1 text-xs py-2"
                  >
                    KATTA HARF
                  </RetroButton>
              </div>

              {/* Big Action Button */}
              <div className="mt-8 pt-6 border-t-2 border-[#FDF6E3]/20 flex justify-center">
                <RetroButton
                  onClick={handleConvert}
                  variant="primary"
                  className="w-full py-4 text-lg md:text-xl bg-[#264653] text-white hover:bg-[#2A9D8F] tracking-widest"
                >
                  O'ZGARTIRISH
                </RetroButton>
              </div>

            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className="text-sm md:text-base font-bold tracking-widest text-[#FDF6E3]/80 uppercase mb-1">
              Chiqish Matni (O'zgartirilgan)
            </h2>
            <div className="flex-grow relative group">
              <div className="absolute inset-0 bg-[#2A9D8F] translate-x-2 translate-y-2 rounded-sm"></div>
              <textarea
                value={outputText}
                readOnly
                className="relative w-full h-[300px] lg:h-[500px] bg-[#FDF6E3] text-[#1a1a2e] p-4 font-mono text-sm md:text-base border-2 border-[#5C4033] outline-none resize-none shadow-inner-retro leading-relaxed"
                placeholder="// Natija shu yerda paydo bo'ladi..."
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 relative">

              <div className="flex-1 relative" ref={downloadMenuRef}>
                 <RetroButton
                    onClick={toggleDownloadMenu}
                    variant="secondary"
                    disabled={!inputText}
                    className="w-full h-full text-xs md:text-sm py-2 bg-[#e9c46a] flex items-center justify-center gap-2"
                  >
                    Fayl Sifatida Yuklash
                    {/* Small arrow icon */}
                    <span className={`transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </RetroButton>

                  {/* Dropdown Menu */}
                  {showDownloadMenu && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-[#FDF6E3] border-2 border-[#5C4033] shadow-neo z-50 flex flex-col p-1 animate-in fade-in zoom-in duration-200">
                         <button
                            onClick={handleDownloadTxt}
                            className="text-left px-4 py-3 hover:bg-[#F4A261] hover:text-[#1a1a2e] text-[#5C4033] font-bold font-mono text-xs uppercase tracking-wider border-b border-[#5C4033]/20 last:border-0"
                         >
                            TXT (.txt)
                         </button>
                         <button
                            onClick={handleDownloadPdf}
                            className="text-left px-4 py-3 hover:bg-[#F4A261] hover:text-[#1a1a2e] text-[#5C4033] font-bold font-mono text-xs uppercase tracking-wider"
                         >
                            PDF (.pdf)
                         </button>
                    </div>
                  )}
              </div>

              <RetroButton 
                onClick={handleCopy} 
                variant="secondary" 
                disabled={!inputText}
                className="flex-1 text-xs md:text-sm py-2 bg-[#e9c46a]"
              >
                {isCopied ? 'Nusxalandi!' : 'Chiqishni Nusxalash'}
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center border-t border-[#FDF6E3]/30 pt-4">
          <p className="text-[10px] md:text-xs font-mono text-[#FDF6E3]/60 tracking-widest uppercase">
            UZBEK DIGITAL HERITAGE LAB TOMONIDAN ISHLAB CHIQILGAN // TONGGI NEOBRUTALIZM 2024 // V1.0 BETA
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="w-2 h-2 bg-[#FDF6E3] rotate-45"></span>
            <span className="w-2 h-2 bg-[#F4A261] rotate-45"></span>
            <span className="w-2 h-2 bg-[#2A9D8F] rotate-45"></span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;
