# Urban Herb Development Guidelines

## Project Overview
CBD marketplace app for Kampala market with mobile money integration and location-based services.

## Technical Stack

### Frontend
```typescript
const frontendStack = {
  framework: "React Native CLI",
  language: "TypeScript",
  styling: "StyleSheet",
  stateManagement: "Redux Toolkit + RTK Query",
  navigation: "@react-navigation/native",
  storage: "AsyncStorage + SQLite",
  authentication: "Phone Number + OTP only",
  payments: "MTN MoMo & Airtel Money"
};
```

### Backend
```python
backendStack = {
    "framework": "Django + DRF",
    "database": "PostgreSQL",
    "caching": "Redis",
    "authentication": "Custom JWT + Phone OTP",
    "file_storage": "AWS S3",
    "payment_integration": ["MTN Mobile Money", "Airtel Money"]
}
```

## Project Structure
```bash
urban-herb/
├── mobile/                 # React Native frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── navigation/   # Navigation setup
│   │   ├── screens/      # Screen components
│   │   ├── services/     # Business logic
│   │   ├── store/        # Redux setup
│   │   ├── theme/        # Styling constants
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Helper functions
│   └── __tests__/        # Frontend tests
│
├── backend/               # Django backend
│   ├── accounts/         # User management
│   ├── products/         # Product management
│   ├── orders/           # Order processing
│   ├── payments/         # Payment integration
│   └── core/             # Core settings
│
├── shared/               # Shared types & constants
└── scripts/             # Development scripts
```

## Development Workflow

### Feature Implementation Flow
1. **Planning Phase**
   - Define API contract
   - Create OpenAPI/Swagger spec
   - Define TypeScript interfaces
   - Document requirements

2. **Backend Implementation**
   - Create/update models
   - Implement serializers
   - Create API endpoints
   - Write tests
   - Document API

3. **Frontend Implementation**
   - Generate/update API types
   - Implement API services
   - Create UI components
   - Write tests
   - Handle error cases

4. **Integration**
   - End-to-end testing
   - Performance testing
   - Security review

### Concurrent Development Strategy
```typescript
const developmentFlow = {
  step1: "Define API contract & types first",
  step2: "Implement backend endpoint with tests",
  step3: "Generate API types for frontend",
  step4: "Implement frontend feature with backend integration",
  step5: "End-to-end testing"
};

const featureFlow = {
  planning: {
    defineContract: "Define API endpoints & types",
    documentation: "OpenAPI/Swagger specification"
  },
  backend: {
    models: "Database models",
    serializers: "Data serialization",
    views: "API endpoints",
    tests: "Unit & integration tests"
  },
  frontend: {
    types: "TypeScript interfaces",
    services: "API integration",
    components: "UI implementation",
    tests: "Component & integration tests"
  }
};
```

### Version Control Strategy
```bash
main           # Production code
├── develop    # Development branch
├── feature/*  # Feature branches
├── bugfix/*   # Bug fix branches
└── release/*  # Release branches
```

### Commit Message Format
```bash
feat: Add mobile money integration
fix: Resolve OTP verification issue
chore: Update dependencies
docs: Update API documentation
test: Add payment integration tests
```

## Quality Assurance

### Code Quality Standards
```typescript
const qualityMeasures = {
  staticAnalysis: {
    typescript: "Strict mode",
    eslint: "Airbnb config + custom rules",
    prettier: "Consistent formatting"
  },
  testing: {
    unit: "Jest + React Native Testing Library",
    integration: "Detox",
    performance: "React Native Performance Monitor"
  },
  monitoring: {
    errors: "Sentry",
    analytics: "Firebase Analytics",
    performance: "Custom metrics tracking"
  }
};
```

### Testing Requirements
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for critical operations
- Security testing for authentication and payments

## Core Requirements Checklist
1. No email/password authentication
2. All transactions through wallet
3. Mobile money for wallet funding only
4. Focus on offline-first approach
5. Optimize for low-bandwidth conditions
6. Support low-end Android devices
7. Follow Uganda-specific UX patterns

## Security Measures
1. Secure storage for sensitive data
2. Certificate pinning
3. Code obfuscation
4. Biometric authentication support
5. Jailbreak/root detection
6. API rate limiting
7. Transaction signing

## Performance Optimization
1. Implement proper list virtualization
2. Optimize image loading and caching
3. Minimize bridge usage
4. Implement efficient state management
5. Use proper caching strategies
6. Optimize API response payload
7. Implement proper pagination

Would you like me to continue with additional sections or expand on any existing ones?

