# Implementation Plan - PWA Integration

## Goal
Transform the application into a Progressive Web App (PWA) to enable offline usage, installation to home screen, and improved performance.

## User Review Required
> [!NOTE]
> We will use `vite-plugin-pwa` for minimal configuration. The app will cache assets for offline use.
> We need to generate a set of icons for the manifest. I will use a placeholder icon generator or create a simple SVG for now.

## Proposed Changes

### 1. Dependencies
- **Action**: Install `vite-plugin-pwa`.
  ```bash
  npm install vite-plugin-pwa -D
  ```

### 2. Vite Configuration
- **File**: `vite.config.ts`
- **Change**: Configure `VitePWA` plugin.
  - Strategy: `generateSW` (simplest for this use case).
  - RegisterType: `autoUpdate`.
  - Manifest:
    - Name: "Samarkand Text Converter"
    - Short Name: "Samarkand"
    - Description: "Uzbek Cyrillic-Latin Text Converter"
    - Theme Color: "#1A1A2E"
    - Icons: 192x192, 512x512.

### 3. Assets
- **File**: `public/pwa-192x192.png`, `public/pwa-512x512.png`
- **Action**: Generate simple icons using `generate_image` or creating SVGs.

### 4. HTML Entry Point
- **File**: `index.html`
- **Change**: Ensure viewport and theme-color meta tags are correct.

### 5. Service Worker Registration
- **File**: `App.tsx` or `main.tsx` (if exists, otherwise `index.tsx`)
- **Change**: `vite-plugin-pwa` handles registration automatically with `registerType: 'autoUpdate'`, but we might need to import `virtual:pwa-register` if we want custom UI for updates. For now, auto-update is fine.

## Verification Plan

### Manual Verification
1.  **Build**: Run `npm run build`.
2.  **Preview**: Run `npm run preview` (PWA doesn't always work in dev mode).
3.  **Lighthouse**: Run Chrome DevTools Lighthouse audit to verify PWA criteria.
4.  **Install**: Check if the "Install" icon appears in the address bar.
5.  **Offline**: Go offline (DevTools > Network > Offline) and refresh the page. App should still load.
