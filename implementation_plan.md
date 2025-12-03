# Implementation Plan - History Functionality

## Goal
Implement a history feature that saves the last 10 conversions and allows users to restore them. This includes a new UI panel to view history and persistence using `localStorage`.

## User Review Required
> [!NOTE]
> History will be automatically saved 2 seconds after the user stops typing, or when they copy/download the text. This ensures we capture "finished" thoughts without spamming the history with every keystroke.

## Proposed Changes

### 1. Type Definitions
- **File**: `types.ts`
- **Change**: Add `HistoryItem` interface.
  ```typescript
  export interface HistoryItem {
    id: string;
    original: string;
    converted: string;
    mode: ConversionMode;
    timestamp: number;
  }
  ```

### 2. State Management & Logic
- **File**: `App.tsx`
- **Change**:
  - Add `history` state: `const [history, setHistory] = useState<HistoryItem[]>([]);`
  - Add `useEffect` to load history from `localStorage` on mount.
  - Add `addToHistory` function to handle saving (checking for duplicates, limiting to 10 items).
  - Add `debouncedSave` logic using `setTimeout` in a `useEffect` dependent on `inputText`.
  - Add `restoreHistoryItem` function to load a history item back into the main inputs.

### 3. UI Components
- **File**: `components/HistoryPanel.tsx` (NEW)
- **Description**: A slide-out drawer or modal that lists history items.
  - **Props**: `history: HistoryItem[]`, `onRestore: (item: HistoryItem) => void`, `onClose: () => void`, `isOpen: boolean`, `theme: 'dark' | 'light'`
  - **Style**: Consistent with the Retro/Neobrutalist theme.

### 4. Integration
- **File**: `App.tsx`
- **Change**:
  - Add a "History" button to the header (next to Theme Toggle?).
  - Render `HistoryPanel` conditionally.
  - Trigger `addToHistory` on "Copy" and "Download" actions as well to ensure immediate saving of important conversions.

## Verification Plan

### Manual Verification
1. **Auto-Save**: Type text, wait 2 seconds. Reload page. Open history. Verify text is there.
2. **Copy-Save**: Type text, click Copy immediately. Open history. Verify text is there.
3. **Restore**: Click a history item. Verify input and output fields update.
4. **Limit**: Create > 10 items. Verify only the latest 10 are kept.
5. **Persistence**: Reload page. Verify history is still there.
6. **Theme**: Toggle theme. Verify History Panel adapts.
