import { ConversionMode } from '../types';

const VOWELS = new Set([
  'а', 'е', 'ё', 'и', 'о', 'у', 'э', 'ю', 'я', 'ў',
  'А', 'Е', 'Ё', 'И', 'О', 'У', 'Э', 'Ю', 'Я', 'Ў'
]);

const MAPPING: Record<string, string> = {
  'а': 'a', 'А': 'A',
  'б': 'b', 'Б': 'B',
  'в': 'v', 'В': 'V',
  'г': 'g', 'Г': 'G',
  'д': 'd', 'Д': 'D',
  'ё': 'yo', 'Ё': 'Yo',
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
  'ц': 'ts', 'Ц': 'Ts',
  'ч': 'ch', 'Ч': 'Ch',
  'ш': 'sh', 'Ш': 'Sh',
  'щ': 'sh', 'Щ': 'Sh',
  'ъ': "'", 'Ъ': "'",
  'ы': 'i', 'Ы': 'I',
  'ь': '', 'Ь': '',
  'э': 'e', 'Э': 'E',
  'ю': 'yu', 'Ю': 'Yu',
  'я': 'ya', 'Я': 'Ya',
  'ў': "o'", 'Ў': "O'",
  'қ': 'q', 'Қ': 'Q',
  'ғ': "g'", 'Ғ': "G'",
  'ҳ': 'h', 'Ҳ': 'H'
};

export const convertText = (text: string, mode: ConversionMode): string => {
  if (!text) return '';
  if (mode !== ConversionMode.CYRILLIC_TO_LATIN) return text;

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : null;

    // Handle 'E' / 'е' rule
    if (char === 'е' || char === 'Е') {
      const isUpperCase = char === 'Е';
      // Check if start of word or after vowel
      // We consider "start of word" as index 0 OR previous char is not a cyrillic letter (e.g. space, punctuation).
      // But strictly: "if first letter of a word OR follows a vowel".
      // Simplified: if i==0 OR prevChar is vowel OR prevChar is not a letter?
      // "Start of word" usually means preceded by boundary.
      // Let's check strict "follows a vowel".

      let isPrecededByVowel = false;
      if (prevChar && VOWELS.has(prevChar)) {
        isPrecededByVowel = true;
      }

      // Check for start of word (or previous is not a Cyrillic letter, roughly)
      // Actually, if it follows a space or punctuation, it's effectively start of word.
      // But the rule specifically says "first letter of a word OR follows a vowel".
      // So if it follows a consonant, it's 'e'.
      // If it follows a space, it's 'ye'.
      // What if it follows `ъ`? `ъ` acts as a separator usually. `s'ezd` -> `syezd`? Yes.
      // So if prevChar is NOT a consonant (and not `ь`?), treat as `ye`?
      // Safer: if prevChar is vowel OR prevChar is none/space/punctuation/special.
      // Essentially: Convert to `ye` UNLESS it follows a consonant.

      // Let's define Consonants?
      // Easier: Convert to `e` ONLY IF it follows a Cyrillic Consonant. Otherwise `ye`.
      // Consonants: all keys in MAPPING minus VOWELS and signs?
      // Let's try to detect if prevChar is a consonant.

      const isPrevConsonant = prevChar && MAPPING[prevChar] && !VOWELS.has(prevChar) && prevChar !== 'ъ' && prevChar !== 'ь' && prevChar !== 'Ъ' && prevChar !== 'Ь';

      if (!prevChar || !MAPPING[prevChar] || VOWELS.has(prevChar) || prevChar === 'ъ' || prevChar === 'Ъ') {
          // "Start of word" (no prev char or prev char not in mapping) OR "After vowel" OR "After hard sign"
          result += isUpperCase ? 'Ye' : 'ye';
      } else {
          result += isUpperCase ? 'E' : 'e';
      }
      continue;
    }

    // Handle standard mapping
    if (MAPPING[char] !== undefined) {
      result += MAPPING[char];
    } else {
      result += char;
    }
  }

  return result;
};
