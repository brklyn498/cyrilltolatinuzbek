import { ConversionMode } from '../types';

export const convertText = (text: string, mode: ConversionMode): string => {
  if (!text) return '';

  switch (mode) {
    case ConversionMode.UPPERCASE:
      return text.toUpperCase();
    case ConversionMode.LOWERCASE:
      return text.toLowerCase();
    case ConversionMode.TITLE_CASE:
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case ConversionMode.SENTENCE_CASE:
      return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    case ConversionMode.REVERSE:
      return text.split('').reverse().join('');
    case ConversionMode.BINARY:
      return text
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    case ConversionMode.HEX:
      return text
        .split('')
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ')
        .toUpperCase();
    case ConversionMode.BASE64:
      try {
        return btoa(text);
      } catch (e) {
        return 'Error: Invalid character for Base64 encoding';
      }
    default:
      return text;
  }
};