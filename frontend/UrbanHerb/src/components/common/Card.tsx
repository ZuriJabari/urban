import React, { useContext } from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    StyleProp,
    TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../../../App';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'filled';
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    variant = 'elevated',
    disabled = false,
}) => {
    const theme = useContext(ThemeContext);
    const Wrapper = onPress ? TouchableOpacity : View;

    return (
        <Wrapper
            style={[
                styles.card,
                styles[variant],
                disabled && styles.disabled,
                style,
            ]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {children}
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: spacing.card.borderRadius,
        padding: spacing.card.padding,
        margin: spacing.card.margin,
        backgroundColor: colors.background.secondary,
    },
    elevated: {
        shadowColor: colors.text.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    outlined: {
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    filled: {
        backgroundColor: colors.background.primary,
    },
    disabled: {
        opacity: 0.5,
    },
}); 