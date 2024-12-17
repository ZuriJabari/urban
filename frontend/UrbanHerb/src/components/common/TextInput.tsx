import React, { useState } from 'react';
import {
    View,
    TextInput as RNTextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface TextInputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    onFocus,
    onBlur,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}
            <RNTextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    inputStyle,
                ]}
                placeholderTextColor={colors.text.secondary}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...rest}
            />
            {error && (
                <Text style={[styles.error, errorStyle]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.input.marginVertical,
    },
    label: {
        ...typography.variants.subtitle2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    input: {
        height: spacing.input.height,
        borderWidth: 1,
        borderColor: colors.border.main,
        borderRadius: spacing.input.borderRadius,
        paddingHorizontal: spacing.input.padding,
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        ...typography.variants.body1,
    },
    inputFocused: {
        borderColor: colors.primary.main,
        backgroundColor: colors.background.secondary,
    },
    inputError: {
        borderColor: colors.status.error,
    },
    error: {
        ...typography.variants.caption,
        color: colors.status.error,
        marginTop: spacing.xs,
    },
}); 