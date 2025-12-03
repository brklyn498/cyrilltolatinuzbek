import React from 'react';

export enum ConversionMode {
  LOWERCASE = 'kichik_harf',
  UPPERCASE = 'katta_harf',
  TITLE_CASE = 'sarlavha_harfi',
  SENTENCE_CASE = 'gap_boshi_harfi',
  CYRILLIC_TO_LATIN = 'cyrillic_latin',
  LATIN_TO_CYRILLIC = 'latin_cyrillic',
  REVERSE = 'teskari',
  BINARY = 'ikkilik',
  HEX = 'hex',
  BASE64 = 'base64'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  fullWidth?: boolean;
}

export const UZBEK_CYR_TO_LAT_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '\'',
  'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o\'', 'қ': 'q',
  'ғ': 'g\'', 'ҳ': 'h',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'J', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'X', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '\'',
  'Ы': 'I', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Ў': 'O\'', 'Қ': 'Q',
  'Ғ': 'G\'', 'Ҳ': 'H'
};