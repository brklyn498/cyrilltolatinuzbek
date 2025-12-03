/**
 * Enum defining the available text conversion modes in the application.
 */
export enum ConversionMode {
  /** Transliterates Cyrillic text to Latin script. */
  CYRILLIC_TO_LATIN = 'LOTINCHAGA OTKAZISH',
  /** Transliterates Latin text to Cyrillic script. */
  LATIN_TO_CYRILLIC = 'KIRILLCHAGA OTKAZISH',
  /** Converts all characters to uppercase. */
  UPPERCASE = 'KATTA HARF',
  /** Converts all characters to lowercase. */
  LOWERCASE = 'KICHIK HARF',
  /** Converts the first character of each word to uppercase. */
  TITLE_CASE = 'SARLAVHA HARFI',
  /** Converts the first character of each sentence to uppercase. */
  SENTENCE_CASE = 'GAP BOSHI HARFI',
  /** Reverses the string. */
  REVERSE = 'TESKARI',
  /** Converts text to its binary representation. */
  BINARY = 'IKKILIK',
  /** Converts text to its hexadecimal representation. */
  HEX = 'HEX',
  /** Encodes text to Base64. */
  BASE64 = 'BASE64',
}

/**
 * Interface representing the state of the converter application.
 * Note: This interface might be used for global state management or context in future iterations.
 */
export interface ConverterState {
  /** The input text to be converted. */
  input: string;
  /** The resulting converted text. */
  output: string;
  /** The currently selected conversion mode. */
  mode: ConversionMode;
}

/**
 * Interface representing a single item in the conversion history.
 */
export interface HistoryItem {
  /** Unique identifier for the history item. */
  id: string;
  /** The original input text. */
  original: string;
  /** The converted output text. */
  converted: string;
  /** The mode used for this conversion. */
  mode: ConversionMode;
  /** Timestamp of when the conversion was saved. */
  timestamp: number;
}
