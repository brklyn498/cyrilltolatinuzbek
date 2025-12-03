import { ConversionMode } from '../types';

// Simple mapping for Uzbek Cyrillic to Latin
const cyrillicToLatinMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': "'",
  'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': "o'", 'қ': 'q',
  'ғ': "g'", 'ҳ': 'h',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'J', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'X', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': "'",
  'Ы': 'I', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Ў': "O'", 'Қ': 'Q',
  'Ғ': "G'", 'Ҳ': 'H'
};

const latinToCyrillicMap: Record<string, string> = {
  "g'": 'ғ', "o'": 'ў', "sh": 'ш', "ch": 'ч', "yo": 'ё', "yu": 'ю', "ya": 'я', "ts": 'ц',
  "G'": 'Ғ', "O'": 'Ў', "Sh": 'Ш', "Ch": 'Ч', "Yo": 'Ё', "Yu": 'Ю', "Ya": 'Я', "Ts": 'Ц',
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'j': 'ж',
  'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
  'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф',
  'x': 'х', 'q': 'қ', 'h': 'ҳ', "'": 'ъ',
  'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'E': 'Е', 'J': 'Ж',
  'Z': 'З', 'I': 'И', 'Y': 'Й', 'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н',
  'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У', 'F': 'Ф',
  'X': 'Х', 'Q': 'Қ', 'H': 'Ҳ'
};

export const convertText = (text: string, mode: ConversionMode): string => {
  if (!text) return '';

  switch (mode) {
    case ConversionMode.LOWERCASE:
      return text.toLowerCase();
    
    case ConversionMode.UPPERCASE:
      return text.toUpperCase();
    
    case ConversionMode.TITLE_CASE:
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );

    case ConversionMode.SENTENCE_CASE:
      return text.replace(
        /(^\s*\w|[.!?]\s*\w)/g,
        (c) => c.toUpperCase()
      );

    case ConversionMode.REVERSE:
      return text.split('').reverse().join('');

    case ConversionMode.CYRILLIC_TO_LATIN:
      return text.split('').map(char => cyrillicToLatinMap[char] || char).join('');

    case ConversionMode.LATIN_TO_CYRILLIC:
      // More complex because of multi-char letters like sh, ch, g', o'
      let result = text;
      // Handle multi-char sequences first
      const special = ["G'", "O'", "Sh", "Ch", "Yo", "Yu", "Ya", "Ts", "g'", "o'", "sh", "ch", "yo", "yu", "ya", "ts"];
      special.forEach(pattern => {
        const regex = new RegExp(pattern, 'g');
        const replacement = latinToCyrillicMap[pattern];
        if (replacement) {
             result = result.replace(regex, replacement);
        }
      });
      // Handle single chars
      return result.split('').map(char => {
          // If it's already cyrillic (from previous step) leave it, otherwise map
          if (Object.values(latinToCyrillicMap).includes(char)) return char;
          return latinToCyrillicMap[char] || char;
      }).join('');

    case ConversionMode.BINARY:
      return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');

    case ConversionMode.HEX:
      return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

    case ConversionMode.BASE64:
      try {
        return btoa(unescape(encodeURIComponent(text)));
      } catch (e) {
        return "Error: Cannot encode to Base64";
      }

    default:
      return text;
  }
};