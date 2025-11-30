import { ConversionMode } from '../types';

const CYRILLIC_TO_LATIN_MAP: { [key: string]: string } = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'ж': 'j',
  'з': 'z',
  'и': 'i',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'x',
  'ч': 'ch',
  'ш': 'sh',
  'ъ': "'",
  'ь': '',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya',
  'ў': "o'",
  'қ': 'q',
  'ғ': "g'",
  'ҳ': 'h',
  'ё': 'yo',
  'ц': 'ts',
  'е': 'e', // Default, handled specially in code but good to have fallback
};

/**
 * Checks if a given character is a Cyrillic vowel.
 *
 * @param char - The character to check.
 * @returns True if the character is a Cyrillic vowel (case-insensitive), false otherwise.
 */
const isCyrillicVowel = (char: string): boolean => {
  return /^[аеёиоуэюяўАЕЁИОУЭЮЯЎ]$/.test(char);
};

/**
 * Checks if a character is an uppercase letter.
 *
 * @param char - The character to check.
 * @returns True if the character is uppercase and differs from its lowercase version, false otherwise.
 */
const isUpperCaseLetter = (char: string): boolean => {
    return char !== char.toLowerCase() && char === char.toUpperCase();
};

/**
 * Transliterates Cyrillic text to Latin script based on Uzbek language rules.
 * Handles specific edge cases like 'е' (ye/e), 'ц' (ts), and smart casing for digraphs.
 *
 * @param text - The Cyrillic text to transliterate.
 * @returns The transliterated Latin text.
 */
const transliterateCyrillicToLatin = (text: string): string => {
  let result = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();

    let base = '';

    // Logic for 'е' (Ye or E)
    if (lowerChar === 'е') {
      let isStartOfWordOrAfterVowel = false;
      if (i === 0) {
        isStartOfWordOrAfterVowel = true;
      } else {
        const prevChar = text[i - 1];
        // If previous char is a vowel OR hard/soft sign (iotation trigger)
        // Or if it's not a cyrillic letter (e.g. space, punctuation)
        if (isCyrillicVowel(prevChar) || prevChar === 'ъ' || prevChar === 'Ъ' || prevChar === 'ь' || prevChar === 'Ь') {
          isStartOfWordOrAfterVowel = true;
        } else if (!/[а-яА-ЯўқғҳЎҚҒҲ]/.test(prevChar)) {
             isStartOfWordOrAfterVowel = true;
        }
      }
      base = isStartOfWordOrAfterVowel ? 'ye' : 'e';
    }
    // Logic for 'ц' (Ts) - Explicitly handled here but map has it too.
    // The map value 'ts' is fine, we just need to ensure we use it.
    // Logic for 'ё' (Yo) - Map has it.
    else if (CYRILLIC_TO_LATIN_MAP[lowerChar] !== undefined) {
      base = CYRILLIC_TO_LATIN_MAP[lowerChar];
    } else {
      // Keep original if not in map
      result += char;
      continue;
    }

    // Apply Case Logic
    if (char === lowerChar) {
        // Original is lowercase
        result += base;
    } else {
        // Original is uppercase
        // Capitalize first letter of base
        const first = base.charAt(0).toUpperCase();
        let rest = base.slice(1);

        if (rest.length > 0) {
            // Determine if 'rest' should be uppercase (Smart Casing)
            let makeSuffixUpper = false;

            const nextChar = (i + 1 < len) ? text[i + 1] : '';

            if (nextChar && isUpperCaseLetter(nextChar)) {
                makeSuffixUpper = true;
            } else if (!nextChar || !/[a-zA-Zа-яА-ЯўқғҳЎҚҒҲ]/.test(nextChar)) {
                // Next is end of string or non-letter (space, punct). Check previous.
                const prevChar = (i - 1 >= 0) ? text[i - 1] : '';
                if (prevChar && isUpperCaseLetter(prevChar)) {
                    makeSuffixUpper = true;
                }
            }

            if (makeSuffixUpper) {
                rest = rest.toUpperCase();
            }
        }
        result += first + rest;
    }
  }
  return result;
};

/**
 * Converts text based on the selected conversion mode.
 *
 * @param text - The input text to convert.
 * @param mode - The conversion mode (e.g., Cyrillic to Latin, Uppercase, Binary, etc.).
 * @returns The converted text string.
 */
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
