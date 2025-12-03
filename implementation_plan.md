# Implementation Plan - Light Mode Integration

## Goal
Integrate the "Light Mode" design from `lightmode_temp` into the main application, allowing users to toggle between the existing "Dark/Retro" mode and the new "Light/Neo-Brutalist" mode.

## User Review Required
> [!IMPORTANT]
> This change will introduce a global theme state. The default theme will remain "Dark" to preserve the current experience, but a toggle will be added.

## Proposed Changes

### 1. Theme Management
- **File**: `App.tsx`
- **Change**: Add `theme` state (`'dark' | 'light'`).
- **Change**: Add `toggleTheme` function.

### 2. Theme Configuration
- **File**: `types.ts` (or new `theme.ts`)
- **Change**: Define color palettes for both themes to avoid hardcoding.
  - **Dark**: Existing colors (`#1A1A2E`, `#F4A261`, `#5C4033`, etc.)
  - **Light**: New colors from `lightmode_temp` (`#F0E6D2`, `#FDF6E3`, `black` borders, etc.)

### 3. Component Updates
- **File**: `components/RetroButton.tsx`
  - Update to accept `theme` prop or context.
  - Apply different classes based on theme (e.g., black borders for light mode, brown for dark).

- **File**: `App.tsx`
  - Update main container background (Gradient vs Solid Light).
  - Update panels and inputs to use theme-aware colors.
  - Add "Theme Toggle" button (likely an icon in the header).

### 4. Migration of Styles
- Map `NeoComponents` styles to `RetroButton` variants when in Light Mode.
  - `NeoButton` styles: `border-2 border-black shadow-neo`
  - `NeoPanel` styles: `bg-[#FDF6E3] border-black`

## Verification Plan

### Automated Tests
- None existing for UI styling.
- Will rely on manual verification.

### Manual Verification
1. **Toggle Test**: Click the new theme toggle button.
   - Verify background changes to Light Mode colors.
   - Verify text becomes dark.
   - Verify buttons change to "Neo" style (black borders).
2. **Functionality Test**: Ensure conversion still works in Light Mode.
3. **Persistence**: (Optional) Check if theme persists on reload (can add `localStorage` later).
4. **Visual Check**: Compare with `lightmode_temp` screenshots/code to ensure fidelity.
