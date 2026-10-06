import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#60646C',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    border: '#E0E1E6',
    tint: '#2E7D32',
    onTint: '#FFFFFF',
    danger: '#C62828',
    overdue: '#C62828',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    background: '#000000',
    backgroundElement: '#1A1B1E',
    border: '#2E3135',
    tint: '#66BB6A',
    onTint: '#000000',
    danger: '#EF5350',
    overdue: '#EF5350',
  },
} as const;

export type Theme = { [K in keyof typeof Colors.light]: string };

export function useTheme(): Theme {
  return Colors[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
