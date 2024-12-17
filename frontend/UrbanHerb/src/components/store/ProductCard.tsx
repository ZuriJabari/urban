import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    onPress: () => void;
    onAddToCart?: () => void;
    onAddToWishlist?: () => void;
    isWishlisted?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    name,
    price,
    salePrice,
    imageUrl,
    onPress,
    onAddToCart,
    onAddToWishlist,
    isWishlisted,
    style,
}) => {
    const formattedPrice = `UGX ${price.toLocaleString()}`;
    const formattedSalePrice = salePrice ? `UGX ${salePrice.toLocaleString()}` : null;

    return (
        <Card
            variant="elevated"
            onPress={onPress}
            style={[styles.container, style]}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {onAddToWishlist && (
                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={onAddToWishlist}
                    >
                        <Icon
                            name={isWishlisted ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isWishlisted ? colors.status.error : colors.text.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>
                    {name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={[styles.price, salePrice && styles.strikethrough]}>
                        {formattedPrice}
                    </Text>
                    {formattedSalePrice && (
                        <Text style={styles.salePrice}>
                            {formattedSalePrice}
                        </Text>
                    )}
                </View>
                {onAddToCart && (
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={onAddToCart}
                    >
                        <Icon name="cart-plus" size={24} color={colors.text.light} />
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 180,
        margin: spacing.sm,
        padding: 0,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    wishlistButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: spacing.xs,
    },
    content: {
        padding: spacing.sm,
    },
    name: {
        ...typography.variants.subtitle2,
        marginBottom: spacing.xs,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    price: {
        ...typography.variants.subtitle1,
        color: colors.text.primary,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: colors.text.secondary,
        marginRight: spacing.sm,
    },
    salePrice: {
        ...typography.variants.subtitle1,
        color: colors.status.error,
    },
    addToCartButton: {
        position: 'absolute',
        bottom: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.primary.main,
        borderRadius: 20,
        padding: spacing.xs,
    },
}); 