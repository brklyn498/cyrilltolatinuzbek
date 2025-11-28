export enum ConversionMode {
  CYRILLIC_TO_LATIN = 'KRILL -> LOTIN',
}

export interface ConverterState {
  input: string;
  output: string;
  mode: ConversionMode;
}
