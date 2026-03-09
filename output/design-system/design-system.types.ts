// Auto-generated Design System Types

export type ColorShade = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  functional: string;
}

export interface ColorPalette {
  primary: ColorShade;
  secondary: ColorShade;
  background: ColorShade;
  text: ColorShade;
  border: ColorShade;
  functional: ColorShade;
}

export type SpacingValue = keyof typeof Spacing;

export const Spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

