import { api } from './config';

export interface OrderItem {
    id: number;
    product: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    vendor: number;
    commission_rate: number;
    commission_amount: number;
    created_at: string;
}

export interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    commission_rate: number;
    commission_amount: number;
    delivery_address: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
    delivery_notes?: string;
    rider?: number;
    payment_method: string;
    payment_reference?: string;
    mobile_money_number: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    confirmed_at?: string;
    processed_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
}

export interface CreateOrderData {
    delivery_address: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
    delivery_notes?: string;
    payment_method: string;
    mobile_money_number: string;
}

export interface OrderFilters {
    status?: string;
    payment_status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
}

export const ordersApi = {
    // Create new order from cart
    createOrder: (data: CreateOrderData) =>
        api.post('/orders/', data),

    // Get all orders with filters
    getOrders: (filters?: OrderFilters) =>
        api.get('/orders/', { params: filters }),

    // Get single order
    getOrder: (orderId: number) =>
        api.get(`/orders/${orderId}/`),

    // Cancel order
    cancelOrder: (orderId: number) =>
        api.post(`/orders/${orderId}/cancel/`),

    // Get order status updates
    getOrderStatusUpdates: (orderId: number) =>
        api.get(`/orders/${orderId}/status-updates/`),

    // Get delivery tracking info
    getDeliveryTracking: (orderId: number) =>
        api.get(`/orders/${orderId}/tracking/`),

    // Rate delivery
    rateDelivery: (orderId: number, rating: number, comment?: string) =>
        api.post(`/orders/${orderId}/rate-delivery/`, { rating, comment }),

    // For vendors: Get orders to fulfill
    getVendorOrders: (filters?: OrderFilters) =>
        api.get('/orders/vendor/', { params: filters }),

    // For vendors: Update order status
    updateOrderStatus: (orderId: number, status: string, notes?: string) =>
        api.post(`/orders/${orderId}/update-status/`, { status, notes }),

    // For riders: Get available deliveries
    getAvailableDeliveries: () =>
        api.get('/orders/available-deliveries/'),

    // For riders: Accept delivery
    acceptDelivery: (orderId: number) =>
        api.post(`/orders/${orderId}/accept-delivery/`),

    // For riders: Update delivery status
    updateDeliveryStatus: (orderId: number, status: string, location?: { latitude: number, longitude: number }) =>
        api.post(`/orders/${orderId}/update-delivery/`, { status, ...location }),
}; 