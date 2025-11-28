export enum ConversionMode {
  UPPERCASE = 'KATTA HARF',
  LOWERCASE = 'KICHIK HARF',
  TITLE_CASE = 'SARLAVHA HARFI',
  SENTENCE_CASE = 'GAP BOSHI HARFI',
  REVERSE = 'TESKARI',
  BINARY = 'IKKILIK',
  HEX = 'HEX',
  BASE64 = 'BASE64',
}

export interface ConverterState {
  input: string;
  output: string;
  mode: ConversionMode;
}