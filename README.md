<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Samarkand Text Converter

**Samarkand Text Converter** is a modern React application designed to transliterate Uzbek text from Cyrillic to Latin script. It also features a suite of text utility tools including casing converters, base64 encoding, and more. The application is built with a unique "Tonggi Neobrutalism" aesthetic, reflecting the digital heritage of Uzbekistan.

## Features

- **Cyrillic to Latin Transliteration**: Accurate conversion based on official Uzbek language rules, handling special characters like 'е', 'ц', and 'ё'.
- **Smart Casing**: Intelligent handling of capitalization for digraphs (e.g., 'Sh', 'Ch', 'Ts') to match the surrounding text context.
- **Text Utilities**:
  - Uppercase / Lowercase
  - Title Case / Sentence Case
  - Text Reversal
  - Binary / Hex / Base64 Encoding
- **File Export**: Download converted text as `.txt` or `.pdf` files.
- **Clipboard Integration**: Easy copy and paste functionality.
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile devices.

## Setup Instructions

**Prerequisites:** Node.js (v14 or higher recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd samarkand-text-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application locally:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or similar, check the console output).

## Usage Guide

1.  **Input Text**: Type or paste your Cyrillic Uzbek text (or any text) into the "Kirish Matni" (Input Text) area on the left.
2.  **Select Mode**: Choose your desired conversion mode from the central control panel. The default is `CYRILLIC -> LATIN`.
3.  **Convert**: Click the large "O'ZGARTIRISH" (Convert) button.
4.  **View Output**: The result will appear in the "Chiqish Matni" (Output Text) area on the right.
5.  **Export/Copy**:
    - Click "Chiqishni Nusxalash" to copy the result to your clipboard.
    - Click "Fayl Sifatida Yuklash" to download the result as a `.txt` or `.pdf` file.

## Project Structure

- `App.tsx`: Main application component.
- `components/`: Reusable UI components (e.g., `RetroButton`).
- `utils/`: Core logic for conversion (`converter.ts`) and PDF generation (`pdfGenerator.ts`).
- `types.ts`: TypeScript definitions for application state and enums.

## Testing

To run the test suite:

```bash
npm test
```
