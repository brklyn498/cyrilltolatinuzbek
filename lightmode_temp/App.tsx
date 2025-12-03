import React, { useState, useEffect } from 'react';
import { ConversionMode } from './types';
import { NeoButton, NeoPanel, NeoTextArea, NeoSelect } from './components/NeoComponents';
import * as Utils from './services/conversionUtils';

const DEFAULT_TEXT = `O'zbekiston Respublikasi Markaziy
Osiyoning markazida joylashgan
davlatdir.
Poytaxti - Toshkent shahri.
Davlat tili - o'zbek tili.
Bu matn lotin alifbosiga avtomatik
ravishda o'giriladi.`;

const App: React.FC = () => {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.LOWERCASE);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    setIsProcessing(true);
    let result = '';

    // Simulate a tiny delay for local ops to give feedback
    await new Promise(r => setTimeout(r, 150));

    try {
      switch (mode) {
        case ConversionMode.LOWERCASE:
          result = input.toLowerCase();
          break;
        case ConversionMode.UPPERCASE:
          result = input.toUpperCase();
          break;
        case ConversionMode.TITLE_CASE:
          result = Utils.toTitleCase(input);
          break;
        case ConversionMode.SENTENCE_CASE:
          result = Utils.toSentenceCase(input);
          break;
        case ConversionMode.CYRILLIC_TO_LATIN:
          result = Utils.toCyrillicToLatin(input);
          break;
        case ConversionMode.REVERSE:
          result = Utils.reverseText(input);
          break;
        case ConversionMode.BINARY:
          result = Utils.toBinary(input);
          break;
        case ConversionMode.HEX:
          result = Utils.toHex(input);
          break;
        case ConversionMode.BASE64:
          result = Utils.toBase64(input);
          break;
        default:
          result = input;
      }
      setOutput(result);
    } catch (error) {
      console.error("Conversion failed", error);
      setOutput("Xatolik yuz berdi / Error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick action handler for the grid buttons
  const setModeAndConvert = (newMode: ConversionMode) => {
    setMode(newMode);
    // Auto convert or wait for user to press big button? 
    // UX Decision: Set mode, let user press big button or have visual feedback.
    // For this demo, clicking the grid button sets the mode. The user presses the big button to execute.
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Nusxalandi! / Copied!');
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const downloadOutput = () => {
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "converted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* Header Banner */}
      <div className="w-full max-w-7xl mb-8 border-2 border-black bg-[#F0E6D2] shadow-neo p-3 text-center transform -rotate-1">
        <h1 className="text-xl md:text-2xl font-mono font-bold tracking-widest uppercase">
          MATN KONVERTORI // SAMARKAND-V1.0 LIGHT THEME
        </h1>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4 h-[600px]">
          <NeoPanel title="KIRISH MATNI (ASL)" className="flex-1">
            <NeoTextArea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Matn kiriting..."
            />
          </NeoPanel>
          <div className="grid grid-cols-2 gap-4">
             <NeoButton onClick={() => setInput('')}>Kirishni Tozalash</NeoButton>
             <NeoButton onClick={pasteFromClipboard}>Xotiradan Joylashtirish</NeoButton>
          </div>
        </div>

        {/* Center Column: Controls */}
        <div className="flex flex-col h-full gap-4 justify-center">
          <NeoPanel title="CONVERSION MODE" className="h-auto py-6 px-4 bg-[#F7F5F0]">
            
            <div className="mb-6">
              <NeoSelect 
                value={mode} 
                onChange={(e) => setMode(e.target.value as ConversionMode)}
              >
                <option value={ConversionMode.LOWERCASE}>KICHIK HARF (lowercase)</option>
                <option value={ConversionMode.UPPERCASE}>KATTA HARF (uppercase)</option>
                <option value={ConversionMode.TITLE_CASE}>SARLAVHA HARFI (Title Case)</option>
                <option value={ConversionMode.SENTENCE_CASE}>GAP BOSHI HARFI (Sentence)</option>
                <option value={ConversionMode.CYRILLIC_TO_LATIN}>CYRILLIC -&gt; LATIN</option>
                <option value={ConversionMode.REVERSE}>TESKARI (Reverse)</option>
                <option value={ConversionMode.BINARY}>IKKILIK (Binary)</option>
                <option value={ConversionMode.HEX}>HEX</option>
                <option value={ConversionMode.BASE64}>BASE64</option>
              </NeoSelect>
            </div>

            <div className="flex flex-col gap-3">
              <NeoButton 
                variant={mode === ConversionMode.CYRILLIC_TO_LATIN ? 'secondary' : 'accent'}
                onClick={() => setModeAndConvert(ConversionMode.CYRILLIC_TO_LATIN)}
                className="py-3"
              >
                CYRILLIC -&gt; LATIN
              </NeoButton>

              <div className="grid grid-cols-2 gap-3">
                <NeoButton 
                  variant={mode === ConversionMode.LOWERCASE ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.LOWERCASE)}
                >
                  KICHIK HARF
                </NeoButton>
                <NeoButton 
                  variant={mode === ConversionMode.TITLE_CASE ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.TITLE_CASE)}
                >
                  SARLAVHA HARFI
                </NeoButton>
              </div>

              <NeoButton 
                variant={mode === ConversionMode.SENTENCE_CASE ? 'secondary' : 'accent'}
                onClick={() => setModeAndConvert(ConversionMode.SENTENCE_CASE)}
              >
                GAP BOSHI HARFI
              </NeoButton>

              <div className="grid grid-cols-2 gap-3">
                 <NeoButton 
                  variant={mode === ConversionMode.REVERSE ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.REVERSE)}
                >
                  TESKARI
                </NeoButton>
                 <NeoButton 
                  variant={mode === ConversionMode.BINARY ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.BINARY)}
                >
                  IKKILIK
                </NeoButton>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <NeoButton 
                  variant={mode === ConversionMode.HEX ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.HEX)}
                >
                  HEX
                </NeoButton>
                 <NeoButton 
                  variant={mode === ConversionMode.BASE64 ? 'secondary' : 'accent'}
                  onClick={() => setModeAndConvert(ConversionMode.BASE64)}
                >
                  BASE64
                </NeoButton>
              </div>

              <NeoButton 
                variant={mode === ConversionMode.UPPERCASE ? 'secondary' : 'accent'}
                onClick={() => setModeAndConvert(ConversionMode.UPPERCASE)}
              >
                KATTA HARF
              </NeoButton>
              
            </div>

            <div className="mt-8">
              <NeoButton 
                variant="primary" 
                fullWidth 
                className="text-lg py-4"
                onClick={handleConvert}
                disabled={isProcessing}
              >
                {isProcessing ? 'JARAYONDA...' : "O'ZGARTIRISH"}
              </NeoButton>
            </div>

          </NeoPanel>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-4 h-[600px]">
          <NeoPanel title="CHIQISH MATNI (O'ZGARTIRILGAN)" className="flex-1">
             <NeoTextArea 
              value={output}
              readOnly
              placeholder="Natija bu yerda paydo bo'ladi..."
            />
          </NeoPanel>
          <div className="grid grid-cols-2 gap-4">
             <NeoButton onClick={downloadOutput}>Fayl Sifatida Yuklash</NeoButton>
             <NeoButton onClick={copyToClipboard}>Chiqishni Nusxalash</NeoButton>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-12 text-center max-w-2xl border-t-2 border-black pt-4">
        <p className="font-mono text-xs uppercase tracking-widest font-bold text-gray-600">
          UZBEK DIGITAL HERITAGE LAB TOMONIDAN ISHLAB CHIQILGAN // TONGGI NEOBRUTALIZM 2024 // V1.0 BETA
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <span className="w-2 h-2 bg-sam-accent rotate-45"></span>
          <span className="w-2 h-2 bg-sam-dark rotate-45"></span>
          <span className="w-2 h-2 bg-sam-accent rotate-45"></span>
        </div>
      </div>

    </div>
  );
};

export default App;