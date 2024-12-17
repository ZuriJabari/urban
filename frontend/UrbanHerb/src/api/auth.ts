import { api } from './config';

export interface RegisterData {
    phone_number: string;
    password: string;
    email?: string;
    user_type: 'CUSTOMER' | 'VENDOR' | 'RIDER';
}

export interface VerifyPhoneData {
    phone_number: string;
    code: string;
}

export interface LoginData {
    phone_number: string;
    password: string;
}

export interface MobileMoneyVerificationData {
    mobile_money_number: string;
}

export const authApi = {
    // Register new user
    register: (data: RegisterData) => 
        api.post('/auth/register/', data),

    // Verify phone number
    verifyPhone: (data: VerifyPhoneData) =>
        api.post('/auth/verify-phone/', data),

    // Login
    login: (data: LoginData) =>
        api.post('/auth/token/', data),

    // Refresh token
    refreshToken: (refresh: string) =>
        api.post('/auth/token/refresh/', { refresh }),

    // Verify mobile money number
    verifyMobileMoney: (data: MobileMoneyVerificationData) =>
        api.post('/auth/verify-mobile-money/', data),

    // Get user profile
    getProfile: () =>
        api.get('/auth/profile/'),

    // Update user profile
    updateProfile: (data: any) =>
        api.put('/auth/profile/update/', data),

    // Get wallet info
    getWallet: () =>
        api.get('/auth/wallet/'),

    // Get wallet transactions
    getWalletTransactions: () =>
        api.get('/auth/wallet/transactions/'),

    // Deposit to wallet
    deposit: (amount: number) =>
        api.post('/auth/wallet/deposit/', { amount }),

    // Withdraw from wallet
    withdraw: (amount: number) =>
        api.post('/auth/wallet/withdraw/', { amount }),
}; 