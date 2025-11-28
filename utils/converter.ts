import { ConversionMode } from '../types';

const CYRILLIC_TO_LATIN_MAP: { [key: string]: string } = {
  'а': 'a', 'А': 'A',
  'б': 'b', 'Б': 'B',
  'в': 'v', 'В': 'V',
  'г': 'g', 'Г': 'G',
  'д': 'd', 'Д': 'D',
  'ж': 'j', 'Ж': 'J',
  'з': 'z', 'З': 'Z',
  'и': 'i', 'И': 'I',
  'й': 'y', 'Й': 'Y',
  'к': 'k', 'К': 'K',
  'л': 'l', 'Л': 'L',
  'м': 'm', 'М': 'M',
  'н': 'n', 'Н': 'N',
  'о': 'o', 'О': 'O',
  'п': 'p', 'П': 'P',
  'р': 'r', 'Р': 'R',
  'с': 's', 'С': 'S',
  'т': 't', 'Т': 'T',
  'у': 'u', 'У': 'U',
  'ф': 'f', 'Ф': 'F',
  'х': 'x', 'Х': 'X',
  'ч': 'ch', 'Ч': 'Ch',
  'ш': 'sh', 'Ш': 'Sh',
  'ъ': "'", 'Ъ': "'",
  'ь': '', 'Ь': '',
  'э': 'e', 'Э': 'E',
  'ю': 'yu', 'Ю': 'Yu',
  'я': 'ya', 'Я': 'Ya',
  'ў': "o'", 'Ў': "O'",
  'қ': 'q', 'Қ': 'Q',
  'ғ': "g'", 'Ғ': "G'",
  'ҳ': 'h', 'Ҳ': 'H',
};

// Check if a character is a vowel (Cyrillic)
const isCyrillicVowel = (char: string): boolean => {
  return /^[аеёиоуэюяўАЕЁИОУЭЮЯЎ]$/.test(char);
};

const transliterateCyrillicToLatin = (text: string): string => {
  let result = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();

    // Logic for 'е' (Ye or E)
    if (lowerChar === 'е') {
      const isUpperCase = char === 'Е';

      let isStartOfWordOrAfterVowel = false;
      if (i === 0) {
        isStartOfWordOrAfterVowel = true;
      } else {
        const prevChar = text[i - 1];
        // If previous char is a vowel OR hard/soft sign (iotation trigger)
        if (isCyrillicVowel(prevChar) || prevChar === 'ъ' || prevChar === 'Ъ' || prevChar === 'ь' || prevChar === 'Ь') {
          isStartOfWordOrAfterVowel = true;
        }
        else if (!/[а-яА-ЯўқғҳЎҚҒҲ]/.test(prevChar)) {
             isStartOfWordOrAfterVowel = true;
        }
      }

      if (isStartOfWordOrAfterVowel) {
        result += isUpperCase ? 'Ye' : 'ye';
      } else {
        result += isUpperCase ? 'E' : 'e';
      }
      continue;
    }

    // Logic for 'ц' (Ts)
    if (lowerChar === 'ц') {
      const isUpperCase = char === 'Ц';
      result += isUpperCase ? 'Ts' : 'ts';
      continue;
    }

    // Logic for 'ё' (Yo)
    if (lowerChar === 'ё') {
       const isUpperCase = char === 'Ё';
       result += isUpperCase ? 'Yo' : 'yo';
       continue;
    }

    // Default mapping
    if (CYRILLIC_TO_LATIN_MAP[char] !== undefined) {
      result += CYRILLIC_TO_LATIN_MAP[char];
    } else {
      // Keep original if not in map
      result += char;
    }
  }
  return result;
};

export const convertText = (text: string, mode: ConversionMode): string => {
  if (!text) return '';

  switch (mode) {
    case ConversionMode.CYRILLIC_TO_LATIN:
      return transliterateCyrillicToLatin(text);
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
