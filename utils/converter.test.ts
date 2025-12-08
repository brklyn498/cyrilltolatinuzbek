import { describe, it, expect } from 'vitest';
import { convertText } from './converter';
import { ConversionMode } from '../types';

describe('Transliteration Logic (Cyrillic to Latin)', () => {

  it('handles basic 1:1 mapping', () => {
    // а -> a, б -> b, etc.
    expect(convertText('абвгд', ConversionMode.CYRILLIC_TO_LATIN)).toBe('abvgd');
    expect(convertText('салом', ConversionMode.CYRILLIC_TO_LATIN)).toBe('salom');
  });

  describe('The "E" Rule', () => {
    it('converts to "ye" at the beginning of a word', () => {
      expect(convertText('Ер', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Yer');
      expect(convertText('ер', ConversionMode.CYRILLIC_TO_LATIN)).toBe('yer');
      expect(convertText('Энг енгил', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Eng yengil');
    });

    it('converts to "ye" after a vowel', () => {
        // Vowels: а, е, ё, и, о, у, э, ю, я, ў
        // 'Moy' -> 'o' is vowel? No, 'y' is consonant. 'o' is vowel.
        // 'oila' -> 'o' is vowel. 'i' follows 'o'.
        // 'aeroport' -> 'a' is vowel. 'e' follows 'a'.
        expect(convertText('Аэропорт', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Aeroport'); // A-e... wait.
        // In Uzbek Cyrillic: Аэропорт. 'А' is vowel. 'э' is 'e'. 'e' after vowel is usually just 'e' unless it is 'е' (ye).
        // The rule is strictly for the letter 'е' (cyrillic ie).
        // Cyrillic 'э' maps to 'e'. Cyrillic 'е' maps to 'ye' or 'e'.

        expect(convertText('Оилае', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Oilaye');
        expect(convertText('Сояе', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Soyaye');
    });

    it('converts to "e" after a consonant', () => {
      expect(convertText('Мен', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Men');
      expect(convertText('Кел', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Kel');
    });

    it('converts to "ye" after special signs (ъ, ь)', () => {
        // Assuming strictness where signs are preserved or affect iotation
        // Current logic: if prev is ъ/ь, become ye.
        // Example: 'Съезд' -> Syezd
        expect(convertText('Съезд', ConversionMode.CYRILLIC_TO_LATIN)).toBe("S'yezd");
        // Note: ъ maps to ' (apostrophe).
        // Code check: base = isStartOfWordOrAfterVowel ? 'ye' : 'e'.
        // if prev is ъ, isStart... = true. So 'ye'.
        // And 'ъ' itself maps to "'".
        // So 'Съезд' -> 'S'yezd'. Correct.
    });
  });

  describe('The "Ц" Rule', () => {
    it('converts "ц" to "ts"', () => {
      expect(convertText('Цирк', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Tsirk');
      expect(convertText('мотоцикл', ConversionMode.CYRILLIC_TO_LATIN)).toBe('mototsikl');
    });
  });

  describe('Smart Casing', () => {
    it('preserves ALL CAPS for digraphs (TS, CH, SH, YO, YA, YU, YE)', () => {
      expect(convertText('КОНЦЕРТ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('KONTSERT');
      expect(convertText('ШАҲАР', ConversionMode.CYRILLIC_TO_LATIN)).toBe('SHAHAR');
      expect(convertText('ЧОЙ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('CHOY');
      expect(convertText('ЁШ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('YOSH');
      expect(convertText('ЯНГИ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('YANGI');
      expect(convertText('ЮЛДУЗ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('YULDUZ');
      expect(convertText('ЕР', ConversionMode.CYRILLIC_TO_LATIN)).toBe('YER'); // Start of word
    });

    it('handles Title Case correctly', () => {
      expect(convertText('Концерт', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Kontsert');
      expect(convertText('Шаҳар', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Shahar');
    });

    it('handles Lower Case correctly', () => {
      expect(convertText('концерт', ConversionMode.CYRILLIC_TO_LATIN)).toBe('kontsert');
    });

    it('handles mixed case in sentences', () => {
        expect(convertText('САЛОМ Дунё', ConversionMode.CYRILLIC_TO_LATIN)).toBe('SALOM Dunyo');
    });
  });

  describe('Special Characters & Signs', () => {
    it('handles apostrophes (ў -> o\', ғ -> g\')', () => {
      expect(convertText('Ўзбекистон', ConversionMode.CYRILLIC_TO_LATIN)).toBe("O'zbekiston");
      expect(convertText('Ғалаба', ConversionMode.CYRILLIC_TO_LATIN)).toBe("G'alaba");
    });

    it('handles hard and soft signs', () => {
      expect(convertText('Маъно', ConversionMode.CYRILLIC_TO_LATIN)).toBe("Ma'no");
      // Soft sign usually removed or treated as apostrophe depending on standard.
      // Current map: 'ь': '' (empty string).
      expect(convertText('Июль', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Iyul');
    });

    it('handles other special chars (қ -> q, ҳ -> h)', () => {
        expect(convertText('Қишлоқ', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Qishloq');
        expect(convertText('Ҳаво', ConversionMode.CYRILLIC_TO_LATIN)).toBe('Havo');
    });
  });

  describe('Mixed Input', () => {
    it('preserves Latin characters, numbers, and symbols', () => {
      const input = "Салом 123! Hello World @#$";
      const expected = "Salom 123! Hello World @#$";
      expect(convertText(input, ConversionMode.CYRILLIC_TO_LATIN)).toBe(expected);
    });

    it('handles special characters and emojis', () => {
        const input = "Салом! 🇺🇿 😊";
        const expected = "Salom! 🇺🇿 😊";
        expect(convertText(input, ConversionMode.CYRILLIC_TO_LATIN)).toBe(expected);
    });

    it('handles null/empty input gracefully', () => {
        expect(convertText('', ConversionMode.CYRILLIC_TO_LATIN)).toBe('');
        // @ts-ignore
        expect(convertText(null, ConversionMode.CYRILLIC_TO_LATIN)).toBe('');
    });
  });

  describe('Transliteration Logic (Latin to Cyrillic)', () => {
    it('handles basic 1:1 mapping', () => {
      expect(convertText('abvgd', ConversionMode.LATIN_TO_CYRILLIC)).toBe('абвгд');
      expect(convertText('salom', ConversionMode.LATIN_TO_CYRILLIC)).toBe('салом');
    });

    it('handles digraphs (sh, ch, ts, yo, yu, ya)', () => {
      expect(convertText('shahar', ConversionMode.LATIN_TO_CYRILLIC)).toBe('шаҳар');
      expect(convertText('choy', ConversionMode.LATIN_TO_CYRILLIC)).toBe('чой');
      expect(convertText('tsirk', ConversionMode.LATIN_TO_CYRILLIC)).toBe('цирк');
      expect(convertText('yosh', ConversionMode.LATIN_TO_CYRILLIC)).toBe('ёш');
      expect(convertText('yulduz', ConversionMode.LATIN_TO_CYRILLIC)).toBe('юлдуз');
      expect(convertText('yangi', ConversionMode.LATIN_TO_CYRILLIC)).toBe('янги');
      // 'ye' is mapped to 'е'
      expect(convertText('yer', ConversionMode.LATIN_TO_CYRILLIC)).toBe('ер');
    });

    it('handles apostrophes (o\' -> ў, g\' -> ғ)', () => {
      expect(convertText("o'zbekiston", ConversionMode.LATIN_TO_CYRILLIC)).toBe('ўзбекистон');
      expect(convertText("g'alaba", ConversionMode.LATIN_TO_CYRILLIC)).toBe('ғалаба');
    });

    describe('Smart Casing (Latin to Cyrillic)', () => {
      it('handles Title Case for digraphs', () => {
        expect(convertText('Shahar', ConversionMode.LATIN_TO_CYRILLIC)).toBe('Шаҳар');
        expect(convertText('Choy', ConversionMode.LATIN_TO_CYRILLIC)).toBe('Чой');
        expect(convertText('Yosh', ConversionMode.LATIN_TO_CYRILLIC)).toBe('Ёш');
      });

      it('handles UPPERCASE for digraphs', () => {
        expect(convertText('SHAHAR', ConversionMode.LATIN_TO_CYRILLIC)).toBe('ШАҲАР');
        expect(convertText('CHOY', ConversionMode.LATIN_TO_CYRILLIC)).toBe('ЧОЙ');
        expect(convertText('YOSH', ConversionMode.LATIN_TO_CYRILLIC)).toBe('ЁШ');
      });

      it('handles mixed case', () => {
        expect(convertText('Salom DUNYO', ConversionMode.LATIN_TO_CYRILLIC)).toBe('Салом ДУНЁ');
      });
    });
  });

  describe('Other Conversion Modes', () => {
    const text = 'Salom Dunyo';
    it('UPPERCASE', () => {
        expect(convertText(text, ConversionMode.UPPERCASE)).toBe('SALOM DUNYO');
    });
    it('LOWERCASE', () => {
        expect(convertText(text, ConversionMode.LOWERCASE)).toBe('salom dunyo');
    });
    it('REVERSE', () => {
        expect(convertText('abc', ConversionMode.REVERSE)).toBe('cba');
    });
  });
});
