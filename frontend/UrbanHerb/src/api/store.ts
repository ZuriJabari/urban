import { api } from './config';

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price?: number;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    ingredients: string;
    weight?: number;
    dimensions?: string;
    category: number;
    vendor: number;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image?: string;
    parent?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductFilters {
    category?: number;
    vendor?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export const storeApi = {
    // Get all products with filters
    getProducts: (filters?: ProductFilters) =>
        api.get('/store/products/', { params: filters }),

    // Get single product by ID or slug
    getProduct: (idOrSlug: string | number) =>
        api.get(`/store/products/${idOrSlug}/`),

    // Get featured products
    getFeaturedProducts: () =>
        api.get('/store/products/', { params: { is_featured: true } }),

    // Get all categories
    getCategories: () =>
        api.get('/store/categories/'),

    // Get single category by ID or slug
    getCategory: (idOrSlug: string | number) =>
        api.get(`/store/categories/${idOrSlug}/`),

    // Get products by category
    getProductsByCategory: (categoryId: number, filters?: ProductFilters) =>
        api.get('/store/products/', { 
            params: { ...filters, category: categoryId } 
        }),

    // Add product to wishlist
    addToWishlist: (productId: number) =>
        api.post('/store/wishlist/', { product: productId }),

    // Remove product from wishlist
    removeFromWishlist: (productId: number) =>
        api.delete(`/store/wishlist/${productId}/`),

    // Get user's wishlist
    getWishlist: () =>
        api.get('/store/wishlist/'),

    // Add product to cart
    addToCart: (productId: number, quantity: number) =>
        api.post('/store/cart/items/', { product: productId, quantity }),

    // Update cart item quantity
    updateCartItem: (itemId: number, quantity: number) =>
        api.put(`/store/cart/items/${itemId}/`, { quantity }),

    // Remove item from cart
    removeFromCart: (itemId: number) =>
        api.delete(`/store/cart/items/${itemId}/`),

    // Get cart contents
    getCart: () =>
        api.get('/store/cart/'),

    // Clear cart
    clearCart: () =>
        api.delete('/store/cart/'),

    // Add product review
    addReview: (productId: number, rating: number, comment: string) =>
        api.post(`/store/products/${productId}/reviews/`, { rating, comment }),

    // Get product reviews
    getProductReviews: (productId: number) =>
        api.get(`/store/products/${productId}/reviews/`),
}; 