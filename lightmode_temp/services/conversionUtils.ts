import { UZBEK_CYR_TO_LAT_MAP } from '../types';

export const toCyrillicToLatin = (text: string): string => {
  return text.split('').map(char => UZBEK_CYR_TO_LAT_MAP[char] || char).join('');
};

export const toTitleCase = (text: string): string => {
  return text.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const toSentenceCase = (text: string): string => {
  return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
};

export const toBinary = (text: string): string => {
  return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
};

export const toHex = (text: string): string => {
  return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
};

export const toBase64 = (text: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    return "Error: Invalid input for Base64";
  }
};

export const reverseText = (text: string): string => {
  return text.split('').reverse().join('');
};