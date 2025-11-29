import { jsPDF } from 'jspdf';

export const generatePdf = (text: string): void => {
  // Initialize PDF (Portrait, Millimeters, A4)
  const doc = new jsPDF('p', 'mm', 'a4');

  // Settings
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 7;
  let cursorY = 20;

  // Header Style
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Grey color for non-invasive look

  // Header Content
  const dateStr = new Date().toLocaleDateString('uz-UZ');
  const headerText = `SAMARKAND CONVERTER // ${dateStr}`;
  doc.text(headerText, margin, cursorY);

  // Separator Line
  cursorY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  // Main Content Style
  cursorY += 10;
  doc.setFont("courier", "normal"); // Monospace font fits the theme
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Wrap text
  const splitText = doc.splitTextToSize(text, contentWidth);

  // Add text to document (handles page breaks automatically if just text,
  // but splitTextToSize returns array of strings. We need to loop for better control or just use text())

  // Simple approach: doc.text handles multi-line array, but doesn't auto-page-break perfectly without help.
  // Better approach: Loop and add pages.

  for (let i = 0; i < splitText.length; i++) {
    // Check if we need a new page
    if (cursorY > 280) { // A4 height is 297mm
      doc.addPage();
      cursorY = 20; // Reset cursor
    }
    doc.text(splitText[i], margin, cursorY);
    cursorY += lineHeight;
  }

  // Save
  doc.save('converted_samarkand.pdf');
};
