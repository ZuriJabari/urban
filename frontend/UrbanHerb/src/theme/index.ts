import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
    colors,
    spacing,
    typography,
};

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography; 