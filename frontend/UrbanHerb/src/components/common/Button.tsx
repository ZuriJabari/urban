import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const getButtonStyle = () => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            ...styles[`${variant}Button`],
            ...styles[`${size}Button`],
            ...(fullWidth && styles.fullWidth),
        };

        if (disabled) {
            return {
                ...baseStyle,
                ...styles.disabledButton,
            };
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        return [
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            disabled && styles.disabledText,
            textStyle,
        ];
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.text.light : colors.primary.main}
                    size={size === 'small' ? 'small' : 'small'}
                />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: spacing.button.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Variants
    primaryButton: {
        backgroundColor: colors.primary.main,
    },
    secondaryButton: {
        backgroundColor: colors.secondary.main,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary.main,
    },
    textButton: {
        backgroundColor: 'transparent',
    },

    // Sizes
    smallButton: {
        height: 32,
        paddingHorizontal: spacing.md,
    },
    mediumButton: {
        height: spacing.button.height,
        paddingHorizontal: spacing.button.padding,
    },
    largeButton: {
        height: 56,
        paddingHorizontal: spacing.lg,
    },

    // Text styles
    text: {
        ...typography.variants.button,
        textAlign: 'center',
    },
    primaryText: {
        color: colors.text.light,
    },
    secondaryText: {
        color: colors.text.light,
    },
    outlineText: {
        color: colors.primary.main,
    },
    textText: {
        color: colors.primary.main,
    },

    // Text sizes
    smallText: {
        fontSize: typography.sizes.sm,
    },
    mediumText: {
        fontSize: typography.sizes.md,
    },
    largeText: {
        fontSize: typography.sizes.lg,
    },

    // Disabled state
    disabledButton: {
        backgroundColor: colors.action.disabled,
        borderColor: colors.action.disabled,
    },
    disabledText: {
        color: colors.text.disabled,
    },

    // Full width
    fullWidth: {
        width: '100%',
    },
}); 