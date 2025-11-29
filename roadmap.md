# Roadmap: Logic Integration & Backend Functionality

**Context:** The UI (HTML/CSS) is complete.
**Objective:** Implement the JavaScript engine to handle transliteration, file generation, and DOM manipulation.

---

## 🧠 Phase 1: The Transliteration Engine
*Build the core logic function independent of the HTML.*

- [x] **Define Mapping Dictionary (`const`)**
    - [x] Create Key-Value pairs for direct 1:1 mapping (e.g., `'а': 'a'`, `'б': 'b'`).
    - [x] **Critical Rule:** Map both Lowercase and Uppercase keys separately to ensure case preservation. (Implemented with smart casing logic)
- [x] **Implement Complex Linguistics Logic**
    - [x] **The "E" Rule:**
        - Logic: If `е` is the *first letter* of a word OR follows a vowel, convert to `ye`.
        - Else: convert to `e`.
    - [x] **The "Ц" Rule:**
        - Logic: Convert `ц` to `ts` (Handles TS/Ts/ts smart casing).
    - [x] **The Apostrophes (Ў & Ғ):**
        - Logic: Convert `ў` to `o'` and `ғ` to `g'`.
    - [x] **The Soft/Hard Signs (ъ / ь):**
        - Logic: Depending on strictness, usually mapped to `'` (apostrophe) or removed entirely in modern Latin Uzbek.
- [x] **Create Main `convertString(text)` Function**
    - [x] Input: String. Output: String.
    - [x] Iterate through string, apply dictionary lookup, apply special rules, return result.

---

## 🔌 Phase 2: DOM & Event Wiring
*Connect the Engine to your Neobrutalist UI.*

- [x] **Element Selection**
    - [x] Cache DOM elements: `inputField`, `outputField`, `btnCopy`, `btnSave`, `btnPdf`.
- [x] **Real-Time Trigger**
    - [x] Add `input` event listener to the Cyrillic Textarea.
    - [x] On keyup/paste: Run `convertString()` and update `outputField.value`.
- [x] **UI State Management**
    - [x] If input is empty, disable Export buttons (add class `.disabled` or attribute `disabled`).

---

## 📋 Phase 3: Clipboard & Reset Actions
*Implement the utility buttons.*

- [x] **Copy Functionality**
    - [x] logic: `navigator.clipboard.writeText(outputValue)`.
    - [x] **Feedback:** Trigger a visual change (e.g., change button text to "COPIED!" for 2 seconds) so the user knows it worked.
- [x] **Clear/Reset Functionality**
    - [x] Logic: Set `inputField.value = ''` and `outputField.value = ''`.
    - [x] Focus cursor back to Input field.

---

## 💾 Phase 4: File Export Engines
*Implement the download capabilities.*

- [x] **.TXT Download System**
    - [x] Create `downloadTxt()` function.
    - [x] Logic:
        1. Create a `Blob` with MIME type `text/plain`.
        2. Create a temporary `<a>` tag with `href = URL.createObjectURL(blob)`.
        3. Set filename to `uzbek-latin-[timestamp].txt`.
        4. Programmatically click the link.
        5. Remove link from DOM.
- [ ] **.PDF Export System**
    - [ ] **Library:** Import `jspdf` (via CDN).
    - [ ] Create `downloadPdf()` function.
    - [ ] Logic:
        1. Initialize `new jsPDF()`.
        2. Set Font to standard (Helvetica/Courier) as output is Latin.
        3. Use `.splitTextToSize()` to wrap text within margins (A4 width is approx 210mm).
        4. `.text(lines, x, y)` to write content.
        5. `.save('uzbek-latin.pdf')`.

---

## 🧪 Phase 5: QA & Edge Case Testing
*Ensure the tool doesn't break.*

- [ ] **Test: Mixed Input**
    - [ ] Paste text containing English, numbers, and Cyrillic together. Ensure only Cyrillic changes.
- [ ] **Test: Special Characters**
    - [ ] Verify `Ў`, `Қ`, `Ғ`, `Ҳ` translate correctly.
- [ ] **Test: Browser Compatibility**
    - [ ] Check functionality on Mobile Chrome vs Desktop.
