# Testing Roadmap

**Objective:** Ensure robust functionality of the Samarkand Text Converter through comprehensive Unit and End-to-End (E2E) testing. This roadmap prioritizes logic verification (especially Latin-to-Cyrillic), edge case handling, and mobile browser compatibility.

---

## 🧪 Phase 1: Unit Testing Expansion (Logic Core)
*Focus: `utils/converter.test.ts`*

### 1.1 Latin-to-Cyrillic Logic (Currently Missing)
The current test suite heavily favors Cyrillic-to-Latin. We need to verify the reverse direction.
- [ ] **Basic Mapping:** Verify simple 1:1 characters (e.g., `a` -> `а`, `b` -> `б`).
- [ ] **Digraphs:** Verify correct conversion of multi-character sequences:
    - `sh` -> `ш`
    - `ch` -> `ч`
    - `ts` -> `ц`
    - `yo` -> `ё`
    - `yu` -> `ю`
    - `ya` -> `я`
    - `ye` -> `е`
- [ ] **Apostrophes:** Verify `o'` -> `ў` and `g'` -> `ғ`.
- [ ] **Smart Casing:**
    - `Sh` -> `Ш` (Title case)
    - `SH` -> `Ш` (All caps logic for single cyrillic char representation) - *Note: Determine if `SH` should be `Ш` or `Ш` depending on context. The converter logic usually maps `SH` to `Ш`.*
    - `sH` -> Edge case handling.

### 1.2 Edge Cases & Mixed Input
- [ ] **Mixed Scripts:** Text containing both Cyrillic and Latin (e.g., "Salom Дунё"). Ensure the converter handles the target direction correctly without mangling the other script if possible, or handles it predictably.
- [ ] **Non-Alphabetic Characters:** Numbers, punctuation, emojis. They should remain unchanged.
- [ ] **Empty/Null Input:** Ensure no crashes.

---

## 📱 Phase 2: E2E Testing (User Experience)
*Focus: `tests/e2e.spec.ts` (Playwright)*

### 2.1 Mobile Compatibility (Automation)
- [ ] **Viewport Emulation:** Explicitly test on mobile viewports (e.g., iPhone 12: 390x844).
- [ ] **Interaction Check:**
    - Verify input field is clickable and writable on small screens.
    - Verify buttons (Copy, Clear, Download) are visible and not obscured by other elements.
    - Verify the "Download" dropdown menu functions correctly on touch/mobile layouts.

### 2.2 Functional Flows
- [ ] **Latin-to-Cyrillic Flow:** Type Latin text, verify Cyrillic output in the UI.
- [ ] **Script Detection:** Type Cyrillic, verify UI (if any indicator exists) or output reflects Latin conversion. Type Latin, verify Cyrillic conversion.

---

## 🔍 Phase 3: Manual Verification Points (If Automation is Flaky)
- **Clipboard Permissions:** Browsers often block `navigator.clipboard.readText()` in automated headless environments. Verify Copy/Paste manually if tests are inconclusive.
- **PDF Generation:** Verify the visual layout of the generated PDF (margins, font rendering).
