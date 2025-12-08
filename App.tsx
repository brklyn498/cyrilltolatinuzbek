import React, { useState, useEffect, useRef } from 'react';
import { RetroButton } from './components/RetroButton';
import { RetroDropdown } from './components/RetroDropdown';
import { HistoryPanel } from './components/HistoryPanel';
import { ConversionMode, HistoryItem } from './types';
import { convertText, detectTextScript } from './utils/converter';
import { generatePdf } from './utils/pdfGenerator';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // State to track if user has manually selected a mode to avoid auto-switching fighting the user
  const [manualModeOverride, setManualModeOverride] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isWrongZone, setIsWrongZone] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Refs to track drag depth to prevent flickering
  const dragCounter = useRef(0);
  const dragCounterOutput = useRef(0);

  /**
   * Handles the text conversion process based on the current mode and input text.
   * Updates the outputText state with the result.
   */
  const handleConvert = () => {
    const result = convertText(inputText, currentMode);
    setOutputText(result);
  };

  /**
   * Auto-detects the script of the input text and switches the mode accordingly,
   * unless the user has manually selected a utility mode (like Binary, Hex, etc.)
   * or explicitly overridden the transliteration direction.
   */
  useEffect(() => {
    if (!inputText) return;

    // Only auto-switch between transliteration modes if we are currently in a transliteration mode
    // or if the input text clearly indicates a script change and we haven't locked the mode.
    // For simplicity in this requirement: We will auto-switch between C2L and L2C based on detection.

    // Check if current mode is one of the transliteration modes
    const isTransliterationMode =
      currentMode === ConversionMode.CYRILLIC_TO_LATIN ||
      currentMode === ConversionMode.LATIN_TO_CYRILLIC;

    if (isTransliterationMode) {
      const detectedScript = detectTextScript(inputText);
      // Auto-switch based on detected script, ignoring manual override for better UX as requested
      if (detectedScript === 'cyrillic' && currentMode !== ConversionMode.CYRILLIC_TO_LATIN) {
        setCurrentMode(ConversionMode.CYRILLIC_TO_LATIN);
      } else if (detectedScript === 'latin' && currentMode !== ConversionMode.LATIN_TO_CYRILLIC) {
        setCurrentMode(ConversionMode.LATIN_TO_CYRILLIC);
      }
    }
  }, [inputText, currentMode]);

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

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversion_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('conversion_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = () => {
    if (!inputText.trim() || !outputText.trim()) return;

    setHistory(prev => {
      // Avoid duplicates at the top of the list
      if (prev.length > 0 && prev[0].original === inputText && prev[0].mode === currentMode) {
        return prev;
      }

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        original: inputText,
        converted: outputText,
        mode: currentMode,
        timestamp: Date.now(),
      };

      const newHistory = [newItem, ...prev].slice(0, 10);
      return newHistory;
    });
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setInputText(item.original);
    // Output will be auto-generated by the effect
    setCurrentMode(item.mode);
    setManualModeOverride(true);
    setIsHistoryOpen(false);
  };

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText && outputText) {
        addToHistory();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [inputText, outputText, currentMode]);

  /**
   * Clears the input and output text areas and sets focus back to the input.
   */
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setManualModeOverride(false); // Reset manual override on clear
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
      setManualModeOverride(false); // Reset override on paste to allow auto-detection
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('Brauzeringiz clipboard-ga ruxsat bermadi (Clipboard permission denied).');
    }
  };

  /**
   * Processes the uploaded file (validates and reads).
   */
  const processFile = (file: File) => {
    // Validation: Check file type
    if (!file.name.toLowerCase().endsWith('.txt') && file.type !== 'text/plain') {
      alert("Faqat .txt formatidagi fayllarni yuklash mumkin! (Only .txt files are allowed)");
      return;
    }

    // Validation: Check file size (Limit: 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      alert("Fayl hajmi juda katta! Maksimal hajm: 5MB. (File is too large! Max size: 5MB)");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setManualModeOverride(false); // Allow auto-detection for the new content
      }
    };

    reader.onerror = () => {
      alert("Faylni o'qishda xatolik yuz berdi. (Error reading file)");
      console.error("FileReader error:", reader.error);
    };

    reader.readAsText(file);
  };

  /**
   * Handles file upload from the system via input.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
    event.target.value = ''; // Reset input
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsWrongZone(false);
    dragCounter.current = 0;
    dragCounterOutput.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleOutputDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterOutput.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsWrongZone(true);
      setIsDragging(true); // Also highlight the correct zone
    }
  };

  const handleOutputDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterOutput.current -= 1;
    if (dragCounterOutput.current === 0) {
      setIsWrongZone(false);
      setIsDragging(false);
    }
  };

  const handleOutputDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOutputDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWrongZone(false);
    setIsDragging(false);
    dragCounter.current = 0;
    dragCounterOutput.current = 0;
    // No action, just prevent default
  };

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  /**
   * Copies the converted output text to the system clipboard.
   * Shows a temporary 'Copied' state on the button.
   */
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    addToHistory(); // Save to history on copy
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
    addToHistory(); // Save to history on download
    setShowDownloadMenu(false);
  };

  /**
   * Triggers the generation and download of the output text as a PDF file.
   */
  const handleDownloadPdf = () => {
    if (!outputText) return;
    generatePdf(outputText);
    addToHistory(); // Save to history on download
    setShowDownloadMenu(false);
  };

  /**
   * Toggles the visibility of the download dropdown menu.
   */
  const toggleDownloadMenu = () => {
    if (!outputText) return;
    setShowDownloadMenu(!showDownloadMenu);
  };

  /**
   * Handles manual mode selection.
   * Sets the mode and enables the override flag to prevent auto-detection from immediately reverting it.
   */
  const handleModeChange = (mode: ConversionMode) => {
    setCurrentMode(mode);
    // If user explicitly clicks a mode button, we consider it a manual override
    setManualModeOverride(true);
  };

  /**
   * Toggles between Cyrillic->Latin and Latin->Cyrillic
   */
  const toggleTransliterationMode = () => {
    if (outputText) {
      setInputText(outputText);
    }

    if (currentMode === ConversionMode.CYRILLIC_TO_LATIN) {
      handleModeChange(ConversionMode.LATIN_TO_CYRILLIC);
    } else {
      handleModeChange(ConversionMode.CYRILLIC_TO_LATIN);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen w-full font-mono p-4 md:p-8 flex flex-col items-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-[#1A1A2E] via-[#4A2C40] to-[#E76F51] text-[#FDF6E3]' : 'bg-pattern-light text-[#1a1a2e]'}`}>

      {/* Main Container Frame */}
      <div className="w-full max-w-7xl border-4 border-[#FDF6E3] p-4 md:p-6 relative bg-white/5 backdrop-blur-sm shadow-2xl rounded-sm">

        {/* Decorative Corner Lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FDF6E3] -mt-1 -ml-1"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FDF6E3] -mt-1 -mr-1"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FDF6E3] -mb-1 -ml-1"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FDF6E3] -mb-1 -mr-1"></div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 z-50 p-2 border-2 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-300 active:rotate-180 ${theme === 'dark' ? 'bg-[#1e2336] border-[#FDF6E3] text-[#FDF6E3]' : 'bg-[#FDF6E3] border-[#5C4033] text-[#5C4033]'}`}
          title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* History Toggle Button */}
        <button
          onClick={() => setIsHistoryOpen(true)}
          className={`absolute top-4 right-16 z-50 p-2 border-2 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#1e2336] border-[#FDF6E3] text-[#FDF6E3]' : 'bg-[#FDF6E3] border-[#5C4033] text-[#5C4033]'}`}
          title="Tarixni ko'rish"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </button>

        {/* Header */}
        <header className="flex justify-center mb-8 md:mb-12 relative">
          <div className={`hidden md:block absolute top-1/2 left-0 w-full h-[2px] -z-10 ${theme === 'dark' ? 'bg-[#FDF6E3]' : 'bg-[#5C4033]'}`}></div>
          <div className={`px-6 py-2 border-2 shadow-neo transform -rotate-1 z-10 relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1e2336] border-[#FDF6E3]' : 'bg-[#FDF6E3] border-[#5C4033]'}`}>
            <h1 className={`text-xl md:text-3xl font-bold tracking-[0.2em] drop-shadow-md font-retro select-none ${theme === 'dark' ? 'text-[#F4A261]' : 'text-[#5C4033]'}`}>
              MATN KONVERTORI // SAMARKAND-V1.0
            </h1>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Input */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className={`text-sm md:text-base font-bold tracking-widest uppercase mb-1 ${theme === 'dark' ? 'text-[#FDF6E3]/80' : 'text-[#5C4033]'}`}>
              Kirish Matni (Asl)
            </h2>
            <div
              className="relative group"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-[#F4A261] translate-x-2 translate-y-2 rounded-sm"></div>

              {/* Drag & Drop Overlay */}
              {isDragging && (
                <div className={`absolute inset-0 z-20 bg-[#FDF6E3]/90 border-4 border-dashed ${isWrongZone ? 'border-[#2A9D8F] animate-pulse' : 'border-[#5C4033]'} flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isWrongZone ? 'text-[#2A9D8F]' : 'text-[#5C4033]'} mb-4 animate-bounce`}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className={`${isWrongZone ? 'text-[#2A9D8F]' : 'text-[#5C4033]'} font-bold text-lg uppercase tracking-widest`}>
                    {isWrongZone ? "Faylni BU YERGA tashlang!" : "Faylni shu yerga tashlang"}
                  </p>
                  <p className={`${isWrongZone ? 'text-[#2A9D8F]/70' : 'text-[#5C4033]/70'} text-sm mt-2 font-mono`}>
                    {isWrongZone ? "(Chap tarafga)" : "(.txt)"}
                  </p>
                </div>
              )}

              {/* Handy Buttons */}
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,text/plain"
                  className="hidden"
                />

                <button
                  onClick={handleTriggerFileUpload}
                  className="p-2 bg-[#2A9D8F] text-white border-2 border-[#5C4033] shadow-neo-sm hover:bg-[#264653] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  title="Fayl Yuklash (.txt)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>
                <button
                  onClick={handlePaste}
                  className="p-2 bg-[#d4a373] text-[#1a1a2e] border-2 border-[#5C4033] shadow-neo-sm hover:bg-[#e9c46a] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  title="Xotiradan Joylashtirish"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 bg-[#e94560] text-white border-2 border-[#5C4033] shadow-neo-sm hover:bg-red-600 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  title="Kirishni Tozalash"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>

              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // We don't reset manual override here to allow user to type in a specific mode if they chose it.
                  // But if they want auto-detection back, they can clear.
                  // Alternatively, we could be smarter here, but simple is better.
                  if (inputText === '') setManualModeOverride(false);
                }}
                className="relative w-full h-[300px] lg:h-[500px] bg-[#FDF6E3] text-[#1a1a2e] p-4 pt-12 font-mono text-sm md:text-base border-2 border-[#5C4033] outline-none focus:border-[#e76f51] resize-none shadow-inner-retro leading-relaxed"
                placeholder="// Matnni shu yerga kiriting..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Middle Column: Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center gap-6 relative py-4 lg:py-0">
            {/* Decorative vertical line for desktop */}
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 left-0 top-0"></div>
            <div className="hidden lg:block absolute h-full w-[2px] bg-[#FDF6E3]/30 right-0 top-0"></div>

            <div className="w-full max-w-sm border-2 border-[#FDF6E3]/50 bg-[#1a1a2e]/60 backdrop-blur-md p-6 rounded-sm shadow-neo">



              {/* Mode Buttons Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <RetroButton
                  variant="accent"
                  isActive={currentMode === ConversionMode.CYRILLIC_TO_LATIN || currentMode === ConversionMode.LATIN_TO_CYRILLIC}
                  onClick={toggleTransliterationMode}
                  className="col-span-2 text-sm py-3 bg-[#F4A261] border-[#5C4033] font-bold flex items-center justify-center gap-2"
                >
                  <span>
                    {currentMode === ConversionMode.LATIN_TO_CYRILLIC ? 'LATIN' : 'CYRILLIC'}
                  </span>
                  <span className="text-lg">→</span>
                  <span>
                    {currentMode === ConversionMode.LATIN_TO_CYRILLIC ? 'CYRILLIC' : 'LATIN'}
                  </span>
                </RetroButton>

                <div className="col-span-2">
                  <RetroDropdown
                    label="Qo'shimcha"
                    value={currentMode}
                    onChange={(value) => handleModeChange(value as ConversionMode)}
                    options={[
                      { label: 'KICHIK HARF', value: ConversionMode.LOWERCASE },
                      { label: 'SARLAVHA HARFI', value: ConversionMode.TITLE_CASE },
                      { label: 'GAP BOSHI HARFI', value: ConversionMode.SENTENCE_CASE },
                      { label: 'TESKARI', value: ConversionMode.REVERSE },
                      { label: 'IKKILIK', value: ConversionMode.BINARY },
                      { label: 'HEX', value: ConversionMode.HEX },
                      { label: 'BASE64', value: ConversionMode.BASE64 },
                      { label: 'KATTA HARF', value: ConversionMode.UPPERCASE },
                    ]}
                  />
                </div>
              </div>

              {/* Removed redundant "O'ZGARTIRISH" button as conversion is real-time */}

            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className={`text-sm md:text-base font-bold tracking-widest uppercase mb-1 ${theme === 'dark' ? 'text-[#FDF6E3]/80' : 'text-[#5C4033]'}`}>
              Chiqish Matni (O'zgartirilgan)
            </h2>
            <div
              className="relative group"
              onDragEnter={handleOutputDragEnter}
              onDragLeave={handleOutputDragLeave}
              onDragOver={handleOutputDragOver}
              onDrop={handleOutputDrop}
            >
              <div className="absolute inset-0 bg-[#2A9D8F] translate-x-2 translate-y-2 rounded-sm"></div>

              {/* Wrong Zone Overlay */}
              {isWrongZone && (
                <div className="absolute inset-0 z-20 bg-[#e94560]/90 border-4 border-dashed border-white flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-4 animate-pulse">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <p className="text-white font-bold text-lg uppercase tracking-widest text-center px-4">Bu yerga emas!</p>
                  <div className="flex items-center gap-2 mt-2 text-white/90 font-mono text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Chap tarafga o'ting</span>
                  </div>
                </div>
              )}

              {/* Handy Copy Button */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={handleCopy}
                  className={`p-2 text-[#1a1a2e] border-2 border-[#5C4033] shadow-neo-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${isCopied ? 'bg-[#2A9D8F] text-white' : 'bg-[#e9c46a] hover:bg-[#f4a261]'}`}
                  title={isCopied ? "Nusxalandi!" : "Nusxalash"}
                >
                  {isCopied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>

              <textarea
                value={outputText}
                readOnly
                className="relative w-full h-[300px] lg:h-[500px] bg-[#FDF6E3] text-[#1a1a2e] p-4 pt-12 font-mono text-sm md:text-base border-2 border-[#5C4033] outline-none resize-none shadow-inner-retro leading-relaxed"
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


            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 text-center border-t pt-4 ${theme === 'dark' ? 'border-[#FDF6E3]/30' : 'border-[#5C4033]/30'}`}>
          <p className={`text-[10px] md:text-xs font-mono tracking-widest uppercase ${theme === 'dark' ? 'text-[#FDF6E3]/60' : 'text-[#5C4033]/60'}`}>
            UZBEK DIGITAL HERITAGE LAB TOMONIDAN ISHLAB CHIQILGAN // TONGGI NEOBRUTALIZM 2024 // V1.0 BETA
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="w-2 h-2 bg-[#FDF6E3] rotate-45"></span>
            <span className="w-2 h-2 bg-[#F4A261] rotate-45"></span>
            <span className="w-2 h-2 bg-[#2A9D8F] rotate-45"></span>
          </div>
        </footer>

      </div>

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={restoreHistoryItem}
        theme={theme}
      />
    </div>
  );
};

export default App;
