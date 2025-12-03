export enum ConversionMode {
  LOWERCASE = 'KICHIK HARF',
  UPPERCASE = 'KATTA HARF',
  TITLE_CASE = 'SARLAVHA HARFI',
  SENTENCE_CASE = 'GAP BOSHI HARFI',
  CYRILLIC_TO_LATIN = 'CYRILLIC -> LATIN',
  LATIN_TO_CYRILLIC = 'LATIN -> CYRILLIC',
  REVERSE = 'TESKARI',
  BINARY = 'IKKILIK',
  HEX = 'HEX',
  BASE64 = 'BASE64'
}

export const MODES_LIST = [
  ConversionMode.LOWERCASE,
  ConversionMode.UPPERCASE,
  ConversionMode.TITLE_CASE,
  ConversionMode.SENTENCE_CASE,
  ConversionMode.CYRILLIC_TO_LATIN,
  ConversionMode.LATIN_TO_CYRILLIC,
  ConversionMode.REVERSE,
  ConversionMode.BINARY,
  ConversionMode.HEX,
  ConversionMode.BASE64
];