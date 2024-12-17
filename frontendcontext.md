# Expert-Level Development Prompt for Cursor AI: Urban Herb Frontend Implementation

## Project Context
Urban Herb is a CBD marketplace app for the Kampala market, Uganda. The system uses:
- Phone number-based authentication (NO email/password)
- Mobile money integration (MTN/Airtel) for wallet funding
- Internal wallet system for all transactions
- Existing Django backend with full API support

## Technical Requirements

### Core Stack
```typescript
const technicalStack = {
  framework: "React Native + Expo",
  styling: "NativeWind",
  stateManagement: "Redux Toolkit + RTK Query",
  navigation: "Expo Router",
  storage: "AsyncStorage + SQLite",
  authentication: "Phone Number + OTP only",
  payments: "Internal Wallet + Mobile Money"
};
```

### Authentication Flow
- Phone number entry → OTP verification → User profile
- No email/password fields anywhere
- Biometric authentication for returning users
- Persistent sessions with secure token storage

### Payment Integration
- Wallet as primary payment method
- Mobile money (MTN/Airtel) for wallet funding only
- Real-time balance updates
- Transaction history
- Auto-retry for failed transactions

## Implementation Strategy

### 1. Project Structure
```bash
frontend/
├── app/                      # Expo Router pages
├── components/               # Reusable components
├── features/                 # Feature-based modules
├── services/                # API and third-party services
├── store/                   # Redux store setup
├── hooks/                   # Custom hooks
├── utils/                   # Helper functions
└── types/                   # TypeScript definitions
```

### 2. Key Features Priority
1. Authentication & Profile Management
2. Product Browsing & Search
3. Wallet & Transactions
4. Order Management
5. Delivery Tracking

### 3. Performance Considerations
- Offline-first architecture
- Image optimization for low-bandwidth
- Aggressive caching
- Background sync for orders/transactions

## Development Guidelines

1. Start with core configuration:
```typescript
// Initialize project with:
npx create-expo-app frontend -t expo-router
cd frontend
npx expo install nativewind@2.0.11
npm install @reduxjs/toolkit react-redux @tanstack/react-query
```

2. Implement authentication first:
```typescript
interface AuthFlow {
  phoneNumberVerification: {
    input: string;          // Phone number input
    validation: RegExp;     // Uganda phone format
    providers: string[];    // SMS providers
  };
  otpVerification: {
    length: number;         // OTP length
    timeout: number;        // Expiry in seconds
    retryLimit: number;     // Max retries
  };
}
```

3. Setup secure storage:
```typescript
interface SecureStorage {
  tokens: {
    access: string;
    refresh: string;
  };
  userData: {
    phoneNumber: string;
    walletId: string;
    biometricEnabled: boolean;
  };
}
```

4. Implement wallet management:
```typescript
interface WalletSystem {
  balance: number;
  transactions: Transaction[];
  fundingMethods: {
    mtn: MobileMoneyProvider;
    airtel: MobileMoneyProvider;
  };
}
```

## Testing Requirements

- Unit tests for components and utilities
- Integration tests for authenticated flows
- Performance testing for image loading
- Offline capability testing

## Key Dependencies
```json
{
  "dependencies": {
    "expo": "~49.0.15",
    "expo-router": "^2.0.0",
    "nativewind": "^2.0.11",
    "react-native-mmkv": "^2.11.0",
    "@shopify/flash-list": "1.4.3",
    "@tanstack/react-query": "^4.36.1",
    "@reduxjs/toolkit": "^1.9.7",
    "expo-secure-store": "~12.3.1",
    "expo-local-authentication": "~13.4.1"
  }
}
```

## Error Handling Strategy
- Comprehensive error boundaries
- Offline error queuing
- Transaction rollback support
- User-friendly error messages

## API Integration
- RTK Query for data fetching
- WebSocket for real-time updates
- Background sync for offline changes
- Request retry with exponential backoff

Remember:
1. No email/password fields anywhere
2. All transactions through wallet only
3. Mobile money for wallet funding only
4. Focus on offline-first approach
5. Optimize for low-bandwidth conditions
6. Support low-end Android devices
7. Follow Uganda-specific UX patterns

Begin implementation in this order:
1. Project setup and configuration
2. Authentication flow
3. Core navigation structure
4. Wallet implementation
5. Product browsing
6. Order management