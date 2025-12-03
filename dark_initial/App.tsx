import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { TextArea } from './components/TextArea';
import { convertText } from './utils/textUtils';
import { ConversionMode, MODES_LIST } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>("O'zbekiston Respublikasi Markaziy Osiyoning markazida joylashgan davlatdir.\nPoytaxti - Toshkent shahri.\nDavlat tili - o'zbek tili.\nBu matn lotin alifbosiga avtomatik ravishda o'giriladi.");
  const [outputText, setOutputText] = useState<string>('');
  const [activeMode, setActiveMode] = useState<ConversionMode>(ConversionMode.LOWERCASE);

  const handleConvert = () => {
    const result = convertText(inputText, activeMode);
    setOutputText(result);
  };

  // Auto-convert when mode or text changes (optional, but convenient for user)
  // The image implies a manual "O'zgartirish" button, so we might keep it manual or hybrid.
  // Let's make the big button the primary trigger, but mode switching updates the "target mode".

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('Brauzeringiz bu amalni qo\'llab-quvvatlamaydi yoki ruxsat berilmagan.');
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      // Optional: Visual feedback
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleDownload = () => {
    if (!outputText) return;
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "converted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-retro-bg text-retro-beige font-mono p-4 md:p-8 flex flex-col items-center">
      
      {/* Header Container */}
      <div className="w-full max-w-7xl border-t-2 border-b-2 border-retro-beige py-4 mb-8 md:mb-12 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-retro-beige mt-1"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-retro-beige mb-1"></div>
        
        <div className="flex justify-center items-center">
          <div className="bg-retro-panel border-2 border-retro-beige px-6 py-2 shadow-neo transform -skew-x-12">
            <h1 className="text-lg md:text-2xl font-bold tracking-widest text-retro-orange transform skew-x-12 uppercase">
              Matn Konvertori // Samarkand-V1.0
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-2 border-l-4 border-retro-orange pl-2">
            Kirish Matni (Asl)
          </h2>
          <TextArea 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder="Matnni bu yerga yozing..."
            accentColor="orange"
          />
          <div className="grid grid-cols-1 gap-3 mt-4">
            <Button label="Kirishni Tozalash" onClick={handleClear} variant="secondary" className="bg-[#E09F3E]" />
            <Button label="Xotiradan Joylashtirish" onClick={handlePaste} variant="secondary" className="bg-[#E09F3E]" />
          </div>
        </div>

        {/* Center Column: Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6 px-0 lg:px-8">
          <div className="border-2 border-retro-beige p-6 relative bg-[#352F36]">
            <h3 className="text-xs uppercase text-center text-retro-orange mb-4 tracking-[0.2em] font-bold">
              Conversion Mode
            </h3>
            
            {/* Mode Selector Dropdown (Simulated with standard select styled roughly) */}
            <div className="mb-6 relative">
               <select 
                value={activeMode}
                onChange={(e) => setActiveMode(e.target.value as ConversionMode)}
                className="w-full bg-retro-cream text-black font-bold p-3 border-2 border-black shadow-neo focus:outline-none appearance-none cursor-pointer uppercase"
              >
                {MODES_LIST.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Specialized buttons based on image */}
              <Button 
                label="Cyrillic -> Latin" 
                onClick={() => setActiveMode(ConversionMode.CYRILLIC_TO_LATIN)} 
                isActive={activeMode === ConversionMode.CYRILLIC_TO_LATIN}
                fullWidth
              />
               <Button 
                label="Latin -> Cyrillic" 
                onClick={() => setActiveMode(ConversionMode.LATIN_TO_CYRILLIC)} 
                isActive={activeMode === ConversionMode.LATIN_TO_CYRILLIC}
                fullWidth
              />
              <Button 
                label="Kichik Harf" 
                onClick={() => setActiveMode(ConversionMode.LOWERCASE)} 
                isActive={activeMode === ConversionMode.LOWERCASE}
              />
              <Button 
                label="Sarlavha Harfi" 
                onClick={() => setActiveMode(ConversionMode.TITLE_CASE)} 
                isActive={activeMode === ConversionMode.TITLE_CASE}
              />
               <Button 
                label="Gap Boshi Harfi" 
                onClick={() => setActiveMode(ConversionMode.SENTENCE_CASE)} 
                isActive={activeMode === ConversionMode.SENTENCE_CASE}
                className="col-span-2"
              />
              <Button 
                label="Teskari" 
                onClick={() => setActiveMode(ConversionMode.REVERSE)} 
                isActive={activeMode === ConversionMode.REVERSE}
              />
              <Button 
                label="Ikkilik" 
                onClick={() => setActiveMode(ConversionMode.BINARY)} 
                isActive={activeMode === ConversionMode.BINARY}
              />
              <Button 
                label="Hex" 
                onClick={() => setActiveMode(ConversionMode.HEX)} 
                isActive={activeMode === ConversionMode.HEX}
              />
              <Button 
                label="Base64" 
                onClick={() => setActiveMode(ConversionMode.BASE64)} 
                isActive={activeMode === ConversionMode.BASE64}
              />
              <Button 
                label="Katta Harf" 
                onClick={() => setActiveMode(ConversionMode.UPPERCASE)} 
                isActive={activeMode === ConversionMode.UPPERCASE}
                className="col-span-2"
              />
            </div>

            {/* Divider */}
            <div className="h-1 bg-retro-panel border-t border-b border-retro-beige/20 mb-6"></div>

            {/* Big Convert Button */}
            <Button 
              label="O'zgartirish" 
              onClick={handleConvert} 
              variant="primary" 
              className="w-full py-6 text-xl tracking-widest"
            />
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-2 border-l-4 border-retro-teal pl-2">
            Chiqish Matni (O'zgartirilgan)
          </h2>
          <TextArea 
            value={outputText} 
            readOnly 
            placeholder="Natija bu yerda paydo bo'ladi..."
            accentColor="teal"
          />
          <div className="grid grid-cols-1 gap-3 mt-4">
            <Button label="Fayl Sifatida Yuklash" onClick={handleDownload} variant="action" />
            <Button label="Chiqishni Nusxalash" onClick={handleCopy} variant="action" />
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-auto w-full max-w-7xl text-center py-6 border-t border-retro-beige/30">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-retro-beige/70">
          Uzbek Digital Heritage Lab tomonidan ishlab chiqilgan // Tonggi Neobrutalism 2024 // V1.0 BETA
        </p>
        <div className="flex justify-center gap-2 mt-2">
           <div className="w-2 h-2 rotate-45 bg-white"></div>
           <div className="w-2 h-2 rotate-45 bg-retro-orange"></div>
           <div className="w-2 h-2 rotate-45 bg-retro-teal"></div>
        </div>
      </footer>

    </div>
  );
};

export default App;