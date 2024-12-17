import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: {
        regular: 'Inter',
        medium: 'Inter-Medium',
        semibold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
    },
    android: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semibold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
    },
});

export const typography = {
    // Font families
    fontFamily,

    // Font sizes
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Font weights
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // Line heights
    lineHeights: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
        xxl: 36,
        xxxl: 40,
    },

    // Predefined text styles
    variants: {
        h1: {
            fontSize: 32,
            fontWeight: '700',
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '600',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        subtitle1: {
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
        },
        subtitle2: {
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 20,
        },
        body1: {
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
        },
        body2: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 20,
        },
        button: {
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 20,
            textTransform: 'uppercase',
        },
        caption: {
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
        },
    },
}; 