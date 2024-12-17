# CBD Marketplace Implementation Guide

## Project Overview
This document provides comprehensive guidance for implementing a CBD marketplace app for the Kampala market. The app will serve as a platform connecting CBD retailers with customers, featuring mobile money payments and location-based services.

# React Native Project Setup Guide

## Project Structure
```
src/
├── api/              # API service layer
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable components
│   ├── common/      # Shared components
│   └── screens/     # Screen-specific components
├── hooks/           # Custom hooks
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── services/        # Business logic and external services
├── store/           # Redux store configuration
│   ├── slices/     # Redux slices
│   └── store.ts    # Store configuration
├── theme/           # Styling and theme constants
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Dependencies Setup

```bash
# Core dependencies
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Additional utilities
npm install axios
npm install dayjs
npm install @react-native-async-storage/async-storage
```

## Redux Toolkit Setup

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
```

## React Query Setup

```typescript
// src/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});
```

```typescript
// src/api/hooks/useUsers.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../axios';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const { data } = await api.put(`/users/${userData.id}`, userData);
      return data;
    },
  });
}
```

## Navigation Setup

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

```typescript
// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```


```typescript
// src/components/common/Button.tsx
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## App Entry Point

```typescript
// App.tsx
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store/store';
import { queryClient } from './src/api/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </Provider>
  );
}
```

## Best Practices

1. **State Management**
   - Use Redux for global app state (auth, theme, etc.)
   - Use React Query for server state
   - Use local state for component-specific state

2. **Navigation**
   - Keep navigation types up to date
   - Use typed navigation props
   - Implement proper deep linking support

3. **Styling**
   - Create reusable style components
   - Use theme constants for colors, spacing, etc.
   - Implement proper dark mode support

4. **Performance**
   - Implement proper list rendering optimization
   - Use memo and callback hooks where necessary
   - Implement proper image caching

5. **TypeScript**
   - Maintain proper type definitions
   - Use strict mode
   - Avoid using any type

6. **Testing**
   - Write unit tests for utilities and hooks
   - Write integration tests for critical flows
   - Implement E2E tests for core functionalities

## Additional Considerations

1. **Error Handling**
   - Implement proper error boundaries
   - Create consistent error handling patterns
   - Log errors properly

2. **Authentication**
   - Implement secure token storage
   - Handle token refresh properly
   - Implement proper logout flow

3. **API Layer**
   - Create typed API clients
   - Implement proper request/response interceptors
   - Handle offline scenarios

4. **Accessibility**
   - Follow React Native accessibility guidelines
   - Test with screen readers
   - Maintain proper contrast ratios

5. **Internationalization**
   - Set up i18n support
   - Handle RTL layouts
   - Support multiple languages

## Development Workflow

1. **Version Control**
   - Follow Git flow or trunk-based development
   - Write meaningful commit messages
   - Review PRs thoroughly

2. **Code Quality**
   - Set up ESLint and Prettier
   - Implement pre-commit hooks
   - Follow consistent coding standards

3. **Documentation**
   - Document components and APIs
   - Maintain up-to-date README
   - Document known issues and workarounds

### Backend Architecture
```python
cbd_marketplace/
  ├── manage.py
  ├── requirements.txt
  ├── accounts/
  │   ├── models.py
  │   ├── serializers.py
  │   ├── views.py
  │   └── urls.py
  ├── products/
  │   ├── models.py
  │   ├── serializers.py
  │   ├── views.py
  │   └── urls.py
  ├── orders/
  │   ├── models.py
  │   ├── serializers.py
  │   ├── views.py
  │   └── urls.py
  ├── payments/
  │   ├── models.py
  │   ├── serializers.py
  │   ├── views.py
  │   └── services/
  │       ├── mtn.py
  │       └── airtel.py
  └── core/
      ├── settings.py
      ├── urls.py
      └── wsgi.py
```

## Implementation Guide

### 1. Environment Setup

First, set up your development environment:a

```bash
# Frontend setup
npx create-expo-app cbd-marketplace-app
cd cbd-marketplace-app
npm install @react-navigation/native @react-navigation/stack @reduxjs/toolkit react-redux axios

# Backend setup
python -m venv env
source env/bin/activate  # or `env\Scripts\activate` on Windows
pip install django djangorestframework django-cors-headers psycopg2-binary
django-admin startproject cbd_marketplace
cd cbd_marketplace
```

### 2. Database Models

Create the core models in Django:

```python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=15)
    location = models.CharField(max_length=200)
    is_dispensary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Dispensary(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=200)
    license_number = models.CharField(max_length=50)
    delivery_zones = models.JSONField()
    operating_hours = models.JSONField()
    
# products/models.py
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='categories/')

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    dispensary = models.ForeignKey('accounts.Dispensary', on_delete=models.CASCADE)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='products/')
    created_at = models.DateTimeField(auto_now_add=True)

# orders/models.py
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]
    
    customer = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    dispensary = models.ForeignKey('accounts.Dispensary', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.TextField(null=True, blank=True)
    is_delivery = models.BooleanField(default=True)
    payment_status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
```

### 3. API Implementation

Set up the REST API endpoints:

```python
# products/views.py
from rest_framework import viewsets
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
        return queryset

# orders/views.py
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        if self.request.user.is_dispensary:
            return Order.objects.filter(dispensary__user=self.request.user)
        return Order.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
```

### 4. Mobile Money Integration

Implement payment processing:

```python
# payments/services/mtn.py
import requests
from django.conf import settings

class MTNMoneyService:
    def __init__(self):
        self.api_key = settings.MTN_API_KEY
        self.base_url = settings.MTN_API_URL

    def initiate_payment(self, phone_number, amount, order_id):
        payload = {
            'amount': amount,
            'currency': 'UGX',
            'phone_number': phone_number,
            'external_id': str(order_id)
        }
        
        response = requests.post(
            f'{self.base_url}/collections',
            json=payload,
            headers={'Authorization': f'Bearer {self.api_key}'}
        )
        
        return response.json()

# payments/views.py
class InitiatePaymentView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        phone_number = request.data.get('phone_number')
        provider = request.data.get('provider')  # 'mtn' or 'airtel'
        
        order = Order.objects.get(id=order_id)
        
        if provider == 'mtn':
            payment_service = MTNMoneyService()
        else:
            payment_service = AirtelMoneyService()
            
        result = payment_service.initiate_payment(
            phone_number=phone_number,
            amount=order.total_amount,
            order_id=order_id
        )
        
        return Response(result)
```

### 5. Frontend Implementation

Implement key screens and components:

```typescript
// src/screens/products/ProductListScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/products/ProductCard';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

// src/components/orders/OrderCard.tsx
const OrderCard = ({ order }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.orderNumber}>Order #{order.id}</Text>
      <Text style={styles.status}>{order.status}</Text>
      <Text style={styles.amount}>
        UGX {order.total_amount.toLocaleString()}
      </Text>
      {order.items.map(item => (
        <View key={item.id} style={styles.item}>
          <Text>{item.product.name}</Text>
          <Text>x{item.quantity}</Text>
        </View>
      ))}
    </View>
  );
};
```

### 6. State Management

Set up Redux store and slices:

```typescript
// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await api.get('/products/');
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

### 7. Design Implementation

Implement the design system:

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#2D5A27',    // Forest Green
    secondary: '#8FBC8F',  // Sage Green
    accent: '#FFD700',     // Golden Yellow
    background: '#F5F5F5', // Light Gray
    text: '#333333',       // Dark Gray
    error: '#FF4444',
    success: '#00C851'
  },
  typography: {
    h1: {
      fontFamily: 'Poppins-Bold',
      fontSize: 24,
      lineHeight: 32
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};
```

### 8. Testing Strategy

Implement comprehensive testing:

```python
# backend/products/tests.py
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Product, Category

class ProductAPITests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price='100.00',
            category=self.category,
            stock=10
        )
        
    def test_get_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
```

### 9. Database Population

Create initial data fixtures:

```python
# products/fixtures/initial_data.json
[
  {
    "model": "products.category",
    "pk": 1,
    "fields": {
      "name": "CBD Oils",
      "description": "High-quality CBD oils for various uses"
    }
  },
  {
    "model": "products.product",
    "pk": 1,
    "fields": {
      "name": "Premium CBD Oil 1000mg",
      "description": "Full-spectrum CBD oil, locally sourced",
      "price": "150000.00",
      "category": 1,
      "stock": 50,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
]
```

### 10. Deployment Configuration

Set up deployment files:

```yaml
# docker-compose.yml
version: '3'

services:
  backend:
    build: ./backend
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    expose:
      - 8000
    environment:
      - DEBUG=0
      - SECRET_KEY=${DJANGO_SECRET_KEY}
      - DATABASE_URL=postgres://postgres:postgres@db:5432/cbd_marketplace
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    volumes:
      - frontend_build:/app/build
    environment:
      - REACT_APP_API_URL=http://backend:8000

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=cbd_marketplace
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres

  redis:
    image: redis:6
    ports:
      - "6379:6379"

  nginx:
    image: nginx:1.19
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - static_volume:/static
      - media_volume:/media
      - frontend_build:/var/www/html
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  static_volume:
  media_volume:
  frontend_build:

# nginx/conf.d/app.conf
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /static/;
    }

    location /media/ {
        alias /media/;
    }
}
```

### 11. Security Implementation

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Security middleware configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# JWT Authentication configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "http://localhost:3000",
]
```

### 12. Performance Optimization

```typescript
// Frontend optimization
// src/utils/imageOptimization.ts
export const getOptimizedImageUrl = (url: string, width: number) => {
    return `${url}?w=${width}&q=75&auto=format`;
};

// src/hooks/useInfiniteScroll.ts
import { useState, useEffect } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop
                !== document.documentElement.offsetHeight) return;
            setIsFetching(true);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return [isFetching, setIsFetching];
};

// Backend optimization
# utils/cache.py
from functools import wraps
from django.core.cache import cache
from django.conf import settings

def cache_response(timeout=settings.CACHE_TIMEOUT):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            cache_key = f"view_{request.path}_{request.user.id}"
            response = cache.get(cache_key)
            
            if response is None:
                response = view_func(request, *args, **kwargs)
                cache.set(cache_key, response, timeout)
                
            return response
        return wrapper
    return decorator
```

### 13. Error Handling and Logging

```python
# backend/utils/error_handling.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        error_data = {
            'error': {
                'status_code': response.status_code,
                'detail': response.data
            }
        }
        
        logger.error(f"API Error: {error_data}")
        return Response(error_data, status=response.status_code)
    
    logger.error(f"Unhandled Exception: {str(exc)}")
    return Response({
        'error': {
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'detail': 'Internal server error'
        }
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### 14. Monitoring and Analytics

```python
# backend/utils/monitoring.py
from prometheus_client import Counter, Histogram
import time

REQUEST_LATENCY = Histogram(
    'http_request_latency_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

REQUEST_COUNT = Counter(
    'http_request_count_total',
    'Total HTTP request count',
    ['method', 'endpoint', 'status']
)

class MetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        
        REQUEST_LATENCY.labels(
            method=request.method,
            endpoint=request.path
        ).observe(time.time() - start_time)
        
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.path,
            status=response.status_code
        ).inc()
        
        return response
```

### 15. Development Workflow

```bash
# Development workflow commands

# Start development servers
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend
npm start

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial data
python manage.py loaddata initial_data.json

# Run tests
# Backend
python manage.py test

# Frontend
npm test

# Build for production
# Frontend
npm run build

# Backend
python manage.py collectstatic
```

### 16. Continuous Integration/Deployment

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        python manage.py test
    
    - name: Build and push Docker images
      if: github.ref == 'refs/heads/main'
      run: |
        docker-compose build
        docker push your-registry/cbd-marketplace-backend
        docker push your-registry/cbd-marketplace-frontend

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/project
          docker-compose pull
          docker-compose up -d
```

This completes the implementation guide for the CBD marketplace app. The guide includes all necessary components for development, deployment, and maintenance of the application. Remember to replace placeholder values (like API keys, domain names, and secrets) with your actual production values.

Follow the development workflow section for local development and testing. For deployment, ensure all security measures are in place and environment variables are properly configured. The CI/CD pipeline will automate the testing and deployment process once set up with your specific repository and deployment environment.


# CBD Marketplace Development Guide

## Development Environment Setup

First, create a standardized development environment setup script that ensures consistency across the team. Save this as `dev-setup.sh`:

```bash
#!/bin/bash

# Check for required system dependencies
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }

# Create project directory structure
mkdir -p cbd-marketplace/{backend,frontend,nginx,scripts,docs}
cd cbd-marketplace

# Set up Python virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install backend dependencies
cd backend
pip install django djangorestframework django-cors-headers psycopg2-binary pytest pytest-django black isort
pip freeze > requirements.txt

# Set up frontend
cd ../frontend
npx create-expo-app . --template blank-typescript
npm install @react-navigation/native @react-navigation/stack @reduxjs/toolkit react-redux axios

# Set up Git hooks
cd ..
cat > .pre-commit-config.yaml << EOL
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
    -   id: trailing-whitespace
    -   id: end-of-file-fixer
    -   id: check-yaml
    -   id: debug-statements
    -   id: detect-private-key

-   repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
    -   id: black

-   repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
    -   id: isort
EOL

# Initialize Git repository
git init
pre-commit install

echo "Development environment setup complete!"
```

## Version Control Strategy

Create a `.gitflow` configuration file:

```ini
[gitflow "branch"]
main = main
develop = develop
feature = feature/
release = release/
hotfix = hotfix/
support = support/

[gitflow "prefix"]
versiontag = v
```

Create branch protection rules in your repository settings:

```json
{
  "protection_rules": {
    "main": {
      "required_reviews": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true,
      "required_status_checks": ["build", "test"]
    },
    "develop": {
      "required_reviews": 1,
      "dismiss_stale_reviews": true,
      "required_status_checks": ["build", "test"]
    }
  }
}
```

## Monitoring and Error Tracking Setup

Create a monitoring configuration file `monitoring/config.py`:

```python
import sentry_sdk
from prometheus_client import Counter, Histogram, Gauge
from functools import wraps
import time

# Business metrics
class Metrics:
    # User activity metrics
    ACTIVE_USERS = Gauge(
        'active_users_total',
        'Number of currently active users',
        ['user_type']
    )
    
    USER_REGISTRATIONS = Counter(
        'user_registrations_total',
        'Total number of user registrations',
        ['user_type']
    )
    
    # Product metrics
    PRODUCT_VIEWS = Counter(
        'product_views_total',
        'Number of product page views',
        ['product_id', 'category']
    )
    
    PRODUCT_SEARCHES = Counter(
        'product_searches_total',
        'Number of product searches',
        ['category', 'has_results']
    )
    
    # Order metrics
    ORDER_VALUE = Histogram(
        'order_value_ugx',
        'Order values in Ugandan Shillings',
        ['payment_method'],
        buckets=[50000, 100000, 200000, 500000, 1000000]
    )
    
    ORDER_COMPLETION_TIME = Histogram(
        'order_completion_seconds',
        'Time taken to complete orders',
        ['order_type'],
        buckets=[60, 300, 600, 1800, 3600]
    )
    
    # Performance metrics
    API_LATENCY = Histogram(
        'api_latency_seconds',
        'API endpoint latency',
        ['endpoint', 'method'],
        buckets=[0.1, 0.5, 1.0, 2.0, 5.0]
    )

def initialize_monitoring(environment):
    """Initialize all monitoring services"""
    # Sentry setup for error tracking
    sentry_sdk.init(
        dsn="your-sentry-dsn",
        environment=environment,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        send_default_pii=False,
        before_send=lambda event, hint: filter_sensitive_data(event)
    )
    
    # Add custom context to Sentry events
    sentry_sdk.set_context("app_version", {
        "version": "1.0.0",
        "environment": environment
    })

def track_performance(func):
    """Decorator to track function performance"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        
        Metrics.API_LATENCY.labels(
            endpoint=func.__name__,
            method=args[0].method if hasattr(args[0], 'method') else 'unknown'
        ).observe(duration)
        
        return result
    return wrapper
```

## Database Management and Optimization

Create `utils/database.py`:

```python
from django.db import connection, transaction
from django.core.cache import cache
from functools import wraps
import logging
import time

logger = logging.getLogger(__name__)

class DatabaseOptimizer:
    @staticmethod
    def analyze_queries(view_func):
        """Decorator to analyze database queries in views"""
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            initial_queries = len(connection.queries)
            start_time = time.time()
            
            result = view_func(*args, **kwargs)
            
            end_time = time.time()
            final_queries = len(connection.queries)
            
            logger.info(f"""
            View: {view_func.__name__}
            Queries executed: {final_queries - initial_queries}
            Execution time: {end_time - start_time:.2f} seconds
            """)
            
            return result
        return wrapper

    @staticmethod
    def cache_query(timeout=3600):
        """Decorator to cache expensive queries"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                cache_key = f"query_{func.__name__}_{hash(str(args) + str(kwargs))}"
                result = cache.get(cache_key)
                
                if result is None:
                    result = func(*args, **kwargs)
                    cache.set(cache_key, result, timeout)
                
                return result
            return wrapper
        return decorator

    @staticmethod
    def bulk_create_context(model_class):
        """Context manager for efficient bulk creation"""
        class BulkCreateContext:
            def __init__(self, model):
                self.model = model
                self.objects = []
            
            def __enter__(self):
                return self
            
            def __exit__(self, exc_type, exc_val, exc_tb):
                if self.objects:
                    self.model.objects.bulk_create(self.objects)
            
            def add(self, **kwargs):
                self.objects.append(self.model(**kwargs))
        
        return BulkCreateContext(model_class)
```

## Automated Testing Configuration

Create `pytest.ini`:

```ini
[pytest]
DJANGO_SETTINGS_MODULE = core.settings.test
python_files = tests.py test_*.py *_tests.py
addopts = --reuse-db --nomigrations --cov=. --cov-report=html
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
```

Create `conftest.py`:

```python
import pytest
from django.core.cache import cache
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.test import override_settings

User = get_user_model()

@pytest.fixture(autouse=True)
def clear_cache():
    """Clear cache before each test"""
    cache.clear()
    yield

@pytest.fixture
def api_client():
    """Provide a test API client"""
    return APIClient()

@pytest.fixture
def test_user(db):
    """Create a test user"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    return user

@pytest.fixture
def authenticated_client(api_client, test_user):
    """Provide an authenticated API client"""
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def mock_mtn_payment(mocker):
    """Mock MTN payment service"""
    return mocker.patch('payments.services.mtn.MTNMoneyService.initiate_payment')

@pytest.fixture
def performance_settings():
    """Override settings for performance testing"""
    with override_settings(
        DEBUG=False,
        CACHES={
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            }
        }
    ):
        yield
```

## Performance Testing

Create `locustfile.py`:

```python
from locust import HttpUser, task, between
from random import choice

class MarketplaceUser(HttpUser):
    wait_time = between(1, 5)
    
    def on_start(self):
        """Log in user when simulation starts"""
        self.client.post("/api/auth/login/", {
            "username": "testuser",
            "password": "testpass123"
        })
    
    @task(3)
    def browse_products(self):
        """Simulate product browsing behavior"""
        # View product list with different filters
        self.client.get("/api/products/")
        self.client.get("/api/products/?category=oils")
        self.client.get("/api/products/?sort=price")
        
        # View individual product details
        product_ids = range(1, 100)
        self.client.get(f"/api/products/{choice(product_ids)}/")
    
    @task(2)
    def search_products(self):
        """Simulate product search behavior"""
        search_terms = ["oil", "cbd", "topical", "cream"]
        self.client.get(f"/api/products/search/?q={choice(search_terms)}")
    
    @task(1)
    def complete_purchase(self):
        """Simulate complete purchase flow"""
        # Add to cart
        self.client.post("/api/cart/add/", {
            "product_id": choice(range(1, 100)),
            "quantity": choice(range(1, 4))
        })
        
        # View cart
        self.client.get("/api/cart/")
        
        # Checkout
        self.client.post("/api/orders/create/", {
            "delivery_address": "Test Address",
            "payment_method": "mtn"
        })

class AdminUser(HttpUser):
    wait_time = between(2, 5)
    weight = 1
    
    def on_start(self):
        """Log in as admin"""
        self.client.post("/api/admin/orders/")
        self.client.get("/api/admin/orders/pending/")
        
    @task
    def manage_orders(self):
        """Simulate admin order management"""
        self.client.get("/api/admin/orders/")
        self.client.get("/api/admin/orders/pending/")
        
    @task
    def manage_inventory(self):
        """Simulate inventory management"""
        self.client.get("/api/admin/inventory/")
        self.client.put(f"/api/admin/products/{choice(range(1, 100))}/", {
            "stock": choice(range(10, 100))
        })
```

## Deployment Configuration

Create `deployment/production.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile.prod
    environment:
      - DJANGO_SETTINGS_MODULE=core.settings.production
      - DATABASE_URL=postgres://user:pass@db:5432/cbd_marketplace
      - REDIS_URL=redis://redis:6379/0
      - MTN_API_KEY=${MTN_API_KEY}
      - AIRTEL_API_KEY=${AIRTEL_API_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - static_files:/app/static
      - media_files:/app/media
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile.prod
    environment:
      - REACT_APP_API_URL=https://api.yourdomain.com
      - REACT_APP_ENVIRONMENT=production
    volumes:
      - frontend_build:/app/build

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=cbd_marketplace
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d cbd_marketplace"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:1.21-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - static_files:/static
      - media_files:/media
      - frontend_build:/var/www/html
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
      - frontend

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $!; done;'"

volumes:
  postgres_data:
  redis_data:
  static_files:
  media_files:
  frontend_build:

## Continuous Integration/Deployment

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        cache: 'pip'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest-cov

    - name: Run tests with coverage
      env:
        DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
      run: |
        pytest --cov=./ --cov-report=xml

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        fail_ci_if_error: true

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to staging
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/staging
          git pull origin develop
          docker-compose -f docker-compose.staging.yml up -d --build

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/production
          git pull origin main
          docker-compose -f docker-compose.production.yml up -d --build

## Development Best Practices

Create `docs/development-guidelines.md`:

```markdown
# Development Guidelines

## Code Style and Standards

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints for function arguments and return values
- Maximum line length: 88 characters (Black formatter default)
- Use docstrings for all public functions and classes

Example:
```python
from typing import List, Optional

def process_order(
    order_id: int,
    user_id: int,
    items: List[dict],
    delivery_address: Optional[str] = None
) -> dict:
    """
    Process a new order with the given items and delivery information.

    Args:
        order_id: Unique identifier for the order
        user_id: ID of the user placing the order
        items: List of items in the order with their quantities
        delivery_address: Optional delivery address for the order

    Returns:
        dict: Processed order information including status and tracking details
    
    Raises:
        InvalidOrderError: If the order validation fails
        PaymentError: If payment processing fails
    """
    # Implementation
```

### TypeScript (Frontend)
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use functional components with hooks
- Implement proper error boundaries

Example:
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stockLevel: number;
}

interface ProductListProps {
  category?: string;
  sortBy?: 'price' | 'name' | 'popularity';
  onProductSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  category,
  sortBy = 'name',
  onProductSelect
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts({ category, sortBy });
        setProducts(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductSelect(product)}
        />
      ))}
    </div>
  );
};
```

## Error Handling

Create a centralized error handling system that provides consistent error responses:

```typescript
// frontend/src/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const code = error.response?.data?.code || 'UNKNOWN_ERROR';
    const message = error.response?.data?.message || 'An unexpected error occurred';

    return new AppError(message, code, status, error.response?.data);
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  );
};
```

```python
# backend/utils/error_handler.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses.
    """
    if isinstance(exc, ValidationError):
        return Response(
            {
                'code': 'VALIDATION_ERROR',
                'message': 'Validation failed',
                'details': exc.message_dict
            },
            status=400
        )

    if isinstance(exc, IntegrityError):
        return Response(
            {
                'code': 'INTEGRITY_ERROR',
                'message': 'Database integrity error',
                'details': str(exc)
            },
            status=400
        )

    response = exception_handler(exc, context)
    
    if response is not None:
        response.data = {
            'code': type(exc).__name__.upper(),
            'message': str(exc),
            'details': response.data
        }
    else:
        logger.error(f"Unhandled exception: {exc}")
        response = Response(
            {
                'code': 'INTERNAL_ERROR',
                'message': 'An unexpected error occurred',
                'details': str(exc) if settings.DEBUG else None
            },
            status=500
        )

    return response
```

## Security Practices

Implement security best practices throughout the application:

```python
# backend/utils/security.py
from django.core.cache import cache
from functools import wraps
from rest_framework.response import Response
import hashlib
import time

def rate_limit(key_prefix: str, limit: int, period: int):
    """
    Rate limiting decorator for API endpoints.
    
    Args:
        key_prefix: Prefix for the rate limit key
        limit: Number of allowed requests
        period: Time period in seconds
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            # Create unique key for this client
            client_ip = request.META.get('REMOTE_ADDR')
            key = f"ratelimit:{key_prefix}:{client_ip}"
            
            # Get current count
            count = cache.get(key, 0)
            
            if count >= limit:
                return Response(
                    {
                        'code': 'RATE_LIMIT_EXCEEDED',
                        'message': 'Too many requests'
                    },
                    status=429
                )
            
            # Increment count
            cache.set(key, count + 1, period)
            
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator

def audit_log(action: str):
    """
    Decorator to log sensitive operations.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            result = func(self, request, *args, **kwargs)
            
            # Log the action
            logger.info(
                f"AUDIT: {action} by user {request.user.id} "
                f"from {request.META.get('REMOTE_ADDR')}"
            )
            
            return result
        return wrapper
    return decorator
```

## Performance Optimization

Implement performance monitoring and optimization:

```python
# backend/utils/performance.py
from django.core.cache import cache
from django.db import connection
from functools import wraps
import time
import logging

logger = logging.getLogger(__name__)

def query_debugger(func):
    """
    Debug database queries in a view.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        reset_queries()
        start_time = time.time()
        
        result = func(*args, **kwargs)
        
        end_time = time.time()
        queries = connection.queries
        
        logger.debug(f"""
        Function: {func.__name__}
        Number of Queries: {len(queries)}
        Execution Time: {end_time - start_time:.2f}s
        
        Queries:
        {'\n'.join(query['sql'] for query in queries)}
        """)
        
        return result
    return wrapper

def cache_response(timeout=300):
    """
    Cache the response of a view.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            # Create cache key
            key = f"view_cache:{request.path}:{request.user.id}"
            response = cache.get(key)
            
            if response is None:
                response = func(self, request, *args, **kwargs)
                cache.set(key, response, timeout)
            
            return response
        return wrapper
    return decorator
```

## Documentation

Keep documentation up to date using automated tools:

```python
# backend/utils/docs.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import get_resolver
import inspect

def generate_api_docs():
    """
    Generate API documentation from view docstrings and type hints.
    """
    resolver = get_resolver()
    api_docs = {}
    
    for pattern in resolver.url_patterns:
        if hasattr(pattern.callback, 'cls'):
            view_class = pattern.callback.cls
            
            # Get endpoint information
            api_docs[pattern.pattern] = {
                'methods': list(view_class.http_method_names),
                'description': inspect.getdoc(view_class),
                'parameters': inspect.signature(
                    view_class.as_view()
                ).parameters
            }
    
    return api_docs

@api_view(['GET'])
def api_documentation(request):
    """
    Endpoint to serve generated API documentation.
    """
    docs = generate_api_docs()
    return Response(docs)
```

This completes the development guide with comprehensive setup, deployment, and best practices documentation. The guide provides a solid foundation for developing and maintaining the CBD marketplace application with high standards of quality, security, and performance.

Remember to customize the configurations and guidelines based on your specific needs and team preferences. Regular reviews and updates of these practices will help maintain code quality and development efficiency throughout the project lifecycle.


# Comprehensive Version Control Guide for CBD Marketplace

## Introduction to Version Control Strategy

Our version control strategy focuses on maintaining code quality, enabling collaborative development, and ensuring smooth deployment processes. This guide provides a structured approach to version control that balances flexibility with stability.

## Branch Structure

We implement a modified GitFlow workflow that simplifies the original model while maintaining its core benefits. Here's our branch hierarchy:

```plaintext
main (production)
├── develop (staging)
│   ├── feature/user-auth
│   ├── feature/product-catalog
│   └── feature/payment-integration
└── hotfix/security-patch
```

### Branch Types and Naming Conventions

```bash
# Main Branches
main                    # Production-ready code
develop                 # Integration branch for features

# Feature Branches
feature/AUTH-123-user-login     # Feature with ticket reference
feature/add-payment-gateway     # Feature without ticket

# Hotfix Branches
hotfix/2.1.1-payment-fix       # Version-specific hotfix
hotfix/security-vulnerability  # Critical security fix

# Release Branches
release/2.1.0                  # Version release branch
```

### Branch Protection Rules

Create a `.github/branch-protection.json` file:

```json
{
  "protection_rules": {
    "main": {
      "required_status_checks": {
        "strict": true,
        "contexts": [
          "continuous-integration/github-actions/pr",
          "security/code-scanning"
        ]
      },
      "enforce_admins": true,
      "required_pull_request_reviews": {
        "required_approving_review_count": 2,
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": true
      },
      "restrictions": {
        "users": ["lead-developer"],
        "teams": ["senior-developers"]
      }
    },
    "develop": {
      "required_status_checks": {
        "strict": true,
        "contexts": ["continuous-integration/github-actions/pr"]
      },
      "required_pull_request_reviews": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews": true
      }
    }
  }
}
```

## Commit Message Guidelines

Create a `.gitmessage` template:

```plaintext
# <type>(<scope>): <subject>
# |<----  Using a Maximum Of 50 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Closes: #123

# --- COMMIT END ---
# Type can be
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semicolons, etc; no code change)
#    doc      (changes to documentation)
#    test     (adding or refactoring tests; no production code change)
#    chore    (updating grunt tasks etc; no production code change)
# --------------------
# Remember to
#    Capitalize the subject line
#    Use the imperative mood in the subject line
#    Do not end the subject line with a period
#    Separate subject from body with a blank line
#    Use the body to explain what and why vs. how
#    Can use multiple lines with "-" for bullet points in body
# --------------------
```

## Git Hooks Setup

Create a `scripts/git-hooks` directory with the following hooks:

```bash
#!/bin/bash
# pre-commit

# Run tests
echo "Running tests..."
python manage.py test
if [ $? -ne 0 ]; then
    echo "Tests must pass before commit!"
    exit 1
fi

# Check code formatting
echo "Checking code formatting..."
black --check .
if [ $? -ne 0 ]; then
    echo "Code must be formatted before commit!"
    exit 1
fi

# Run linting
echo "Running linting..."
flake8 .
if [ $? -ne 0 ]; then
    echo "Code must pass linting before commit!"
    exit 1
fi
```

```bash
#!/bin/bash
# commit-msg

#!/bin/bash
# This hook validates commit messages against our standard format

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Regex for validation
commit_format='^(feat|fix|refactor|style|doc|test|chore)(\([a-zA-Z0-9-]+\))?: .{1,50}$'

if ! echo "$commit_msg" | grep -qE "$commit_format"; then
    echo "ERROR: Invalid commit message format."
    echo "Please use the format: type(scope): subject"
    echo "Examples:"
    echo "  feat(auth): add user login functionality"
    echo "  fix(payments): resolve transaction timeout issue"
    exit 1
fi
```

## Workflow Automation

Create a `.github/workflows/branch-workflow.yml`:

```yaml
name: Branch Workflow

on:
  push:
    branches:
      - feature/**
      - hotfix/**
      - develop
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Branch Name
        run: |
          branch_name=${GITHUB_REF#refs/heads/}
          if [[ ! $branch_name =~ ^(feature|hotfix|develop|main)/ ]]; then
            echo "Invalid branch name format"
            exit 1
          fi
      
      - name: Validate Commit Messages
        run: |
          git log --format=%B -n 1 ${{ github.sha }} | \
          grep -E '^(feat|fix|refactor|style|doc|test|chore)(\([a-zA-Z0-9-]+\))?: .{1,50}$' || \
          (echo "Invalid commit message format" && exit 1)

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install black flake8
          
      - name: Run linting
        run: |
          black --check .
          flake8 .

  test:
    runs-on: ubuntu-latest
    needs: [validate, lint]
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
          
      - name: Run tests
        run: |
          python manage.py test
```

## Version Control Best Practices

### Daily Workflow

1. Start your day by updating your local repository:

```bash
# Update main branches
git checkout main
git pull origin main
git checkout develop
git pull origin develop

# Update your feature branch
git checkout feature/your-feature
git rebase develop
```

2. Create a new feature branch:

```bash
# From develop branch
git checkout develop
git pull origin develop
git checkout -b feature/AUTH-123-user-login

# Or for a hotfix
git checkout main
git pull origin main
git checkout -b hotfix/2.1.1-payment-fix
```

3. Make regular commits:

```bash
# Stage changes
git add .

# Commit with proper message
git commit -m "feat(auth): implement user login with email verification

- Add email verification service
- Implement JWT token generation
- Add password hashing utility

Closes: #123"
```

4. Push your changes:

```bash
# First push to remote
git push -u origin feature/AUTH-123-user-login

# Subsequent pushes
git push
```

### Code Review Process

Create a `PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
[Provide a brief description of the changes introduced by this PR]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?
[Describe the tests that you ran to verify your changes]

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Merge Strategies

Configure `.gitconfig` for the repository:

```ini
[merge]
    ff = only
    commit = no
    strategy = recursive
    strategy-option = patience

[pull]
    rebase = true

[rebase]
    autoStash = true
```

### Conflict Resolution Strategy

Create a `docs/conflict-resolution.md`:

```markdown
# Conflict Resolution Guidelines

1. Always rebase feature branches onto develop:
   ```bash
   git checkout feature/your-feature
   git rebase develop
   ```

2. If conflicts occur:
   ```bash
   # Resolve conflicts in each file
   git add <resolved-file>
   git rebase --continue
   ```

3. For complex conflicts:
   ```bash
   # Abort rebase and create a dedicated merge commit
   git rebase --abort
   git merge develop
   ```

4. After resolution:
   ```bash
   # Force push if necessary (only for feature branches)
   git push --force-with-lease
   ```
```

### Release Process

Create a `scripts/release.sh`:

```bash
#!/bin/bash

# Ensure we're on develop
git checkout develop
git pull origin develop

# Create release branch
version=$1
git checkout -b release/$version

# Update version numbers
sed -i "s/version=.*/version='$version'/" setup.py
sed -i "s/\"version\": .*/\"version\": \"$version\",/" package.json

# Commit version updates
git add setup.py package.json
git commit -m "chore(release): bump version to $version"

# Merge to main
git checkout main
git merge --no-ff release/$version -m "chore(release): merge version $version"

# Tag the release
git tag -a v$version -m "Release version $version"

# Update develop
git checkout develop
git merge --no-ff release/$version -m "chore(release): merge version $version to develop"

# Delete release branch
git branch -d release/$version

# Push everything
git push origin main develop --tags
```

### Repository Maintenance

Create scheduled maintenance tasks in `.github/workflows/maintenance.yml`:

```yaml
name: Repository Maintenance

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Clean up stale branches
        run: |
          # Delete merged feature branches older than 30 days
          git branch --merged | grep -E 'feature/' | xargs git branch -d
          
      - name: Verify repository integrity
        run: |
          git fsck --full
          git gc --aggressive
          
      - name: Check for security vulnerabilities
        uses: github/codeql-action/analyze@v2
```

## Version Control Tools and Extensions

### VS Code Extensions
Install these extensions for better Git integration:

```json
{
    "recommendations": [
        "eamodio.gitlens",
        "donjayamanne.githistory",
        "mhutchie.git-graph",
        "github.vscode-pull-request-github"
    ]
}
```

### Git Aliases

Add these to your `.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    rb = rebase
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    undo = reset HEAD~1 --mixed
    amend = commit --amend --no-edit
    cleanup = !git branch --merged | grep -v \"\\*\" | xargs -n 1 git branch -d
```

## Conclusion

This version control strategy provides a robust foundation for collaborative development while maintaining code quality and project stability. Follow these guidelines consistently to ensure smooth development workflow and minimize potential conflicts or issues.

Remember to:
- Always work in feature branches
- Keep commits atomic and well-documented
- Regularly rebase feature branches on develop
- Follow the pull request process
- Use meaningful commit messages
- Regularly update your local repository

By following these practices, we can maintain a clean and efficient development process that scales with the project's growth.


# Extended Implementation Context for CBD Marketplace

## Mobile Device Context

### Device Landscape Analysis
```json
{
  "deviceDistribution": {
    "android": {
      "percentage": 85,
      "commonVersions": [
        {
          "version": "Android 10",
          "marketShare": 35,
          "minApiLevel": 29
        },
        {
          "version": "Android 11",
          "marketShare": 28,
          "minApiLevel": 30
        },
        {
          "version": "Android 12",
          "marketShare": 22,
          "minApiLevel": 31
        }
      ],
      "commonDevices": [
        {
          "model": "Samsung Galaxy A12",
          "screenSize": "6.5 inches",
          "resolution": "720 x 1600",
          "marketShare": 15
        },
        {
          "model": "Tecno Spark 7",
          "screenSize": "6.52 inches",
          "resolution": "720 x 1600",
          "marketShare": 12
        }
      ]
    },
    "ios": {
      "percentage": 15,
      "minimumVersion": "iOS 13",
      "commonDevices": [
        {
          "model": "iPhone 11",
          "screenSize": "6.1 inches",
          "resolution": "828 x 1792",
          "marketShare": 8
        }
      ]
    }
  }
}
```

### Network Conditions
```python
NETWORK_PROFILES = {
    "urban_4g": {
        "bandwidth": "5-15 Mbps",
        "latency": "50-150ms",
        "coverage": "80% of Kampala",
        "reliability": "95%"
    },
    "urban_3g": {
        "bandwidth": "1-5 Mbps",
        "latency": "100-300ms",
        "coverage": "95% of Kampala",
        "reliability": "90%"
    },
    "offline_capabilities": {
        "required_features": [
            "Product browsing",
            "Cart management",
            "Order history",
            "Store locations"
        ],
        "sync_strategy": {
            "frequency": "On network restore",
            "priority_data": [
                "Order status",
                "Payment confirmations",
                "Product inventory"
            ]
        }
    }
}
```

### Performance Optimization
```python
PERFORMANCE_REQUIREMENTS = {
    "image_optimization": {
        "thumbnail": {
            "size": "150x150",
            "quality": 80,
            "format": "WebP"
        },
        "product_display": {
            "size": "600x600",
            "quality": 85,
            "format": "WebP"
        },
        "lazy_loading": {
            "threshold": "500px",
            "placeholder": "blur_hash"
        }
    },
    "caching_strategy": {
        "products": {
            "duration": "4 hours",
            "invalidation": ["price_change", "stock_update"]
        },
        "user_data": {
            "duration": "1 hour",
            "invalidation": ["order_status", "profile_update"]
        }
    }
}
```

## Business Rules

### Order Management
```python
ORDER_RULES = {
    "minimum_order": {
        "amount": 30000,  # UGX
        "message": "Minimum order amount is 30,000 UGX",
        "exceptions": ["promotional_orders"]
    },
    "cancellation_policy": {
        "timeframe": "1 hour",
        "conditions": [
            "Order not yet processed",
            "Payment not yet processed"
        ],
        "refund_rules": {
            "full_refund": {
                "conditions": ["Cancelled within 1 hour"],
                "processing_time": "3-5 business days"
            },
            "partial_refund": {
                "conditions": ["Cancelled after processing"],
                "deduction": "10% processing fee"
            }
        }
    },
    "delivery_windows": {
        "weekday": {
            "start_time": "09:00",
            "end_time": "21:00",
            "slot_duration": "60 minutes"
        },
        "weekend": {
            "start_time": "10:00",
            "end_time": "20:00",
            "slot_duration": "60 minutes"
        },
        "special_dates": {
            "holidays": "10:00-18:00",
            "ramadan": "10:00-22:00"
        }
    }
}
```

### Inventory Management
```python
INVENTORY_RULES = {
    "stock_thresholds": {
        "low_stock": 10,
        "critical_stock": 5,
        "max_stock": 100
    },
    "availability_rules": {
        "display_threshold": 3,
        "reserve_duration": "15 minutes",
        "backorder_allowed": False
    },
    "product_limits": {
        "max_quantity_per_order": 5,
        "bulk_order_threshold": 3,
        "bulk_order_discount": "5%"
    }
}
```

## User Experience Flows

### Authentication Flow
```python
AUTH_FLOWS = {
    "registration": {
        "required_fields": [
            "phone_number",
            "full_name",
            "delivery_address",
            "password"
        ],
        "validation_steps": [
            {
                "step": "Phone verification",
                "method": "SMS OTP",
                "timeout": "5 minutes",
                "retries": 3
            },
            {
                "step": "Location verification",
                "method": "GPS coordinates",
                "fallback": "Manual address entry"
            }
        ]
    },
    "login": {
        "methods": [
            "Phone number + password",
            "OTP login"
        ],
        "session_management": {
            "duration": "30 days",
            "max_devices": 3,
            "concurrent_sessions": True
        }
    }
}
```

### Order Flow
```python
ORDER_FLOWS = {
    "checkout_process": {
        "steps": [
            {
                "name": "Cart review",
                "validations": [
                    "Stock availability",
                    "Minimum order amount",
                    "Delivery area coverage"
                ]
            },
            {
                "name": "Delivery selection",
                "options": [
                    {
                        "type": "Standard delivery",
                        "timeframe": "60-90 minutes",
                        "price": "5000 UGX"
                    },
                    {
                        "type": "Express delivery",
                        "timeframe": "30-45 minutes",
                        "price": "10000 UGX"
                    },
                    {
                        "type": "Pickup",
                        "timeframe": "Ready in 30 minutes",
                        "price": "0 UGX"
                    }
                ]
            },
            {
                "name": "Payment selection",
                "options": [
                    {
                        "method": "MTN Mobile Money",
                        "processing_time": "1-2 minutes"
                    },
                    {
                        "method": "Airtel Money",
                        "processing_time": "1-2 minutes"
                    }
                ]
            }
        ]
    }
}
```

### Error Handling
```python
ERROR_HANDLING = {
    "user_messages": {
        "network_error": {
            "message": "Connection lost. Don't worry, your order is saved.",
            "action": "Retry connection",
            "persistence": "Local storage"
        },
        "payment_failure": {
            "message": "Payment unsuccessful. Please try again.",
            "action": "Retry payment",
            "alternative": "Try different payment method"
        },
        "stock_unavailable": {
            "message": "Some items in your cart are no longer available",
            "action": "Update cart",
            "alternative": "View similar products"
        }
    },
    "recovery_procedures": {
        "incomplete_order": {
            "detection": "Session timeout or app close",
            "action": "Save to draft",
            "restoration": "On next app open"
        },
        "payment_timeout": {
            "detection": "No callback after 2 minutes",
            "action": "Check transaction status",
            "resolution": "Auto-retry or cancel"
        }
    }
}
```

## Integration Details

### Mobile Money Integration
```python
PAYMENT_INTEGRATION = {
    "mtn_money": {
        "api_version": "2.0",
        "endpoints": {
            "base_url": "https://api.mtn.com/collection/v1",
            "initialize": "/payment",
            "status": "/payment/{reference}/status",
            "notification": "/webhook"
        },
        "headers": {
            "Authorization": "Bearer {token}",
            "x-reference-id": "{uuid}",
            "x-target-environment": "production",
            "Content-Type": "application/json"
        },
        "timeout": 120,
        "retry_strategy": {
            "max_attempts": 3,
            "interval": 10,
            "backoff_factor": 2
        }
    },
    "airtel_money": {
        "api_version": "1.0",
        "endpoints": {
            "base_url": "https://openapi.airtel.africa",
            "initialize": "/merchant/v1/payments",
            "status": "/standard/v1/payments/{reference}",
            "notification": "/merchant/v1/webhook"
        },
        "headers": {
            "Authorization": "Bearer {token}",
            "Content-Type": "application/json",
            "X-Country": "UG",
            "X-Currency": "UGX"
        },
        "timeout": 120,
        "retry_strategy": {
            "max_attempts": 3,
            "interval": 10,
            "backoff_factor": 2
        }
    }
}
```

### Transaction Reconciliation
```python
RECONCILIATION_CONFIG = {
    "schedule": {
        "frequency": "Every 30 minutes",
        "timeout": 300,
        "max_retries": 3
    },
    "matching_rules": {
        "primary_keys": [
            "transaction_reference",
            "phone_number",
            "amount"
        ],
        "time_window": "24 hours",
        "tolerance": {
            "amount": 0,
            "timestamp": "5 minutes"
        }
    },
    "resolution_steps": [
        {
            "status": "pending",
            "action": "Auto-check payment status",
            "interval": "5 minutes",
            "max_attempts": 6
        },
        {
            "status": "mismatched",
            "action": "Manual review queue",
            "notification": "Admin alert"
        },
        {
            "status": "failed",
            "action": "Automatic refund initiation",
            "notification": "Customer SMS"
        }
    ]
}
```

### Webhook Handling
```python
WEBHOOK_CONFIG = {
    "endpoints": {
        "payment_notification": {
            "url": "/api/webhooks/payment",
            "methods": ["POST"],
            "authentication": "HMAC",
            "retry_policy": {
                "max_attempts": 5,
                "interval": 300,
                "backoff": "exponential"
            }
        },
        "order_status": {
            "url": "/api/webhooks/order",
            "methods": ["POST"],
            "authentication": "API_KEY",
            "retry_policy": {
                "max_attempts": 3,
                "interval": 600,
                "backoff": "linear"
            }
        }
    },
    "security": {
        "ip_whitelist": [
            "MTN_IP_RANGE",
            "AIRTEL_IP_RANGE"
        ],
        "signature_validation": {
            "algorithm": "SHA256",
            "header": "X-Webhook-Signature",
            "tolerance": "300 seconds"
        }
    },
    "processing": {
        "async": True,
        "queue": "high-priority",
        "timeout": 30,
        "idempotency": {
            "key_header": "X-Idempotency-Key",
            "storage_duration": "24h"
        }
    }
}
```

### Error Recovery
```python
ERROR_RECOVERY = {
    "payment_timeout": {
        "detection": {
            "condition": "No callback within 2 minutes",
            "verification_steps": [
                "Check transaction status with provider",
                "Verify internal order status",
                "Check payment provider logs"
            ]
        },
        "resolution": {
            "automatic": [
                "Retry status check",
                "Send customer notification",
                "Update order status"
            ],
            "manual": [
                "Support ticket creation",
                "Customer callback initiation",
                "Transaction investigation"
            ]
        }
    },
    "order_fulfillment": {
        "issues": {
            "stock_mismatch": {
                "detection": "Inventory check failure",
                "resolution": [
                    "Partial fulfillment option",
                    "Alternative product suggestion",
                    "Customer notification"
                ]
            },
            "delivery_failure": {
                "detection": "Delivery status update timeout",
                "resolution": [
                    "Reattempt scheduling",
                    "Customer contact",
                    "Refund processing"
                ]
            }
        }
    }
}
```

This extended context provides detailed specifications for implementing the CBD marketplace with proper consideration for local market conditions, technical requirements, and user expectations in Kampala. The structured format allows for systematic implementation while addressing specific market needs and challenges.

Remember to update these configurations based on real user feedback and market conditions as the application evolves.



# Essential Features for a World-Class CBD Marketplace App

## Core User Experience Features

### Personalization Engine
```python
class PersonalizationSystem:
    def __init__(self):
        self.ml_model = RecommendationModel()
        self.user_preferences = UserPreferenceTracker()
    
    def customize_experience(self, user_id: str) -> dict:
        """
        Generate personalized content and recommendations
        """
        return {
            "recommendations": {
                "products": self.get_personalized_products(user_id),
                "categories": self.get_category_preferences(user_id)
            },
            "ui_preferences": {
                "favorite_dispensaries": self.get_preferred_locations(user_id),
                "preferred_delivery_times": self.get_delivery_preferences(user_id)
            },
            "content": {
                "educational_materials": self.get_relevant_content(user_id),
                "promotions": self.get_targeted_promotions(user_id)
            }
        }

class UserPreferenceTracker:
    def track_behavior(self, user_id: str, action: str):
        """
        Track user interactions for better personalization
        """
        behaviors = {
            "product_views": self.update_product_interest,
            "search_patterns": self.analyze_search_behavior,
            "purchase_history": self.update_purchase_patterns,
            "time_patterns": self.analyze_usage_times
        }
```

### Smart Search and Discovery
```python
class AdvancedSearch:
    def __init__(self):
        self.search_engine = ElasticSearch()
        self.ml_processor = NLPProcessor()
    
    def process_search(self, query: str, user_context: dict) -> dict:
        """
        Process search with natural language understanding
        """
        return {
            "instant_results": self.get_instant_matches(query),
            "suggested_categories": self.categorize_query(query),
            "related_searches": self.get_related_queries(query),
            "trending_products": self.get_trending_in_context(query)
        }
    
    def enhance_results(self, results: list, user_context: dict) -> list:
        """
        Enhance search results with user context and preferences
        """
        return self.ml_processor.rerank_results(
            results=results,
            user_history=user_context.get('history'),
            location=user_context.get('location'),
            time_of_day=user_context.get('time')
        )
```

### Real-time Inventory Management
```python
class InventoryTracker:
    def __init__(self):
        self.inventory_db = RealTimeDatabase()
        self.analytics = InventoryAnalytics()
    
    def track_stock_levels(self, product_id: str) -> dict:
        """
        Monitor and update stock levels in real-time
        """
        return {
            "current_stock": self.get_real_time_stock(product_id),
            "availability": self.check_availability(product_id),
            "reservations": self.get_active_reservations(product_id),
            "predicted_stockout": self.predict_stockout_time(product_id)
        }
    
    def manage_reservations(self, order_id: str, products: list):
        """
        Handle product reservations during checkout
        """
        self.create_temporary_hold(order_id, products)
        self.schedule_hold_release(order_id, timeout='15m')
```

### Seamless Payment Processing
```python
class PaymentProcessor:
    def __init__(self):
        self.payment_providers = {
            'mtn': MTNMoneyHandler(),
            'airtel': AirtelMoneyHandler()
        }
        self.transaction_monitor = TransactionMonitor()
    
    async def process_payment(self, payment_details: dict) -> dict:
        """
        Handle payment processing with automatic retries and fallback
        """
        provider = self.get_optimal_provider(payment_details)
        
        try:
            result = await provider.initiate_payment(payment_details)
            self.transaction_monitor.track_transaction(result['transaction_id'])
            return result
        except PaymentException as e:
            return await self.handle_payment_failure(e, payment_details)
```

### Dynamic Delivery System
```python
class DeliveryManager:
    def __init__(self):
        self.route_optimizer = RouteOptimizer()
        self.delivery_tracker = DeliveryTracker()
    
    def optimize_delivery(self, orders: list) -> dict:
        """
        Optimize delivery routes and timing
        """
        return {
            "routes": self.route_optimizer.calculate_optimal_routes(orders),
            "estimated_times": self.calculate_delivery_times(orders),
            "driver_assignments": self.assign_optimal_drivers(orders)
        }
    
    def track_delivery(self, order_id: str) -> dict:
        """
        Provide real-time delivery tracking
        """
        return {
            "current_location": self.get_driver_location(order_id),
            "estimated_arrival": self.calculate_eta(order_id),
            "delivery_status": self.get_detailed_status(order_id)
        }
```

## Advanced Features

### AI-Powered Product Recommendations
```python
class RecommendationEngine:
    def generate_recommendations(self, user_id: str) -> dict:
        """
        Generate personalized product recommendations
        """
        user_profile = self.get_user_profile(user_id)
        return {
            "personal_picks": self.get_personalized_suggestions(user_profile),
            "trending_now": self.get_trending_products(user_profile['location']),
            "similar_users": self.get_collaborative_filtering_results(user_id)
        }
```

### Smart Notifications
```python
class NotificationManager:
    def send_contextual_notification(self, user_id: str, event: str):
        """
        Send context-aware notifications
        """
        user_preferences = self.get_user_preferences(user_id)
        notification = self.create_personalized_message(event, user_preferences)
        
        self.optimize_delivery_time(notification, user_preferences)
        self.track_notification_engagement(notification['id'])
```

### Advanced Analytics Dashboard
```python
class AnalyticsDashboard:
    def generate_business_insights(self) -> dict:
        """
        Generate comprehensive business analytics
        """
        return {
            "sales_metrics": self.analyze_sales_patterns(),
            "user_behavior": self.analyze_user_engagement(),
            "inventory_insights": self.analyze_inventory_movement(),
            "delivery_performance": self.analyze_delivery_efficiency()
        }
```

## Security Features

### Advanced Fraud Detection
```python
class FraudDetection:
    def analyze_transaction(self, transaction: dict) -> dict:
        """
        Analyze transactions for potential fraud
        """
        return {
            "risk_score": self.calculate_risk_score(transaction),
            "suspicious_patterns": self.detect_patterns(transaction),
            "verification_needed": self.determine_verification_requirements(transaction)
        }
```

### Multi-factor Authentication
```python
class SecurityManager:
    def implement_mfa(self, user_id: str) -> dict:
        """
        Implement multi-factor authentication
        """
        return {
            "primary": self.setup_password_authentication(),
            "secondary": self.setup_phone_verification(),
            "biometric": self.setup_biometric_authentication()
        }
```

## Performance Features

### Performance Optimization
```python
class PerformanceOptimizer:
    def optimize_app_performance(self) -> dict:
        """
        Implement performance optimizations
        """
        return {
            "caching": self.implement_smart_caching(),
            "image_optimization": self.optimize_image_delivery(),
            "network_handling": self.implement_offline_capabilities(),
            "load_balancing": self.setup_load_distribution()
        }
```

### Offline Capabilities
```python
class OfflineManager:
    def manage_offline_functionality(self) -> dict:
        """
        Handle offline app functionality
        """
        return {
            "data_sync": self.setup_background_sync(),
            "offline_storage": self.implement_local_storage(),
            "conflict_resolution": self.handle_data_conflicts()
        }
```

## User Support Features

### In-app Support System
```python
class SupportSystem:
    def provide_user_support(self) -> dict:
        """
        Implement comprehensive user support
        """
        return {
            "chat_support": self.setup_live_chat(),
            "help_center": self.create_knowledge_base(),
            "ticket_system": self.implement_ticket_tracking()
        }
```

### Feedback and Rating System
```python
class FeedbackManager:
    def manage_user_feedback(self) -> dict:
        """
        Handle user feedback and ratings
        """
        return {
            "product_reviews": self.manage_product_ratings(),
            "delivery_feedback": self.collect_delivery_ratings(),
            "app_feedback": self.gather_app_feedback()
        }
```

These features represent the foundation of a world-class app, emphasizing user experience, performance, security, and support. Each component is designed to work seamlessly together while maintaining high standards of reliability and user satisfaction. The implementation should focus on creating a cohesive system that provides value through every interaction.




# CBD Marketplace Delivery Fee Calculation System

## Core Delivery Fee Structure

```python
class DeliveryFeeCalculator:
    """
    Calculates delivery fees based on distance and order characteristics.
    Base rate is 1000 UGX per kilometer with various modifiers.
    """
    def __init__(self):
        self.BASE_RATE_PER_KM = 1000  # UGX per kilometer
        self.MIN_ORDER_FOR_FREE_DELIVERY = 200000  # UGX
        self.MIN_ORDER_FOR_DISCOUNT = 100000  # UGX
        self.DISCOUNT_PERCENTAGE = 0.5  # 50% discount
        self.MAX_DELIVERY_FEE = 25000  # UGX
        self.MIN_DELIVERY_FEE = 5000  # UGX

    def calculate_fee(self, distance_km: float, order_total: float, user_tier: str,
                     is_peak_hours: bool, weather_condition: str) -> dict:
        """
        Calculate the final delivery fee considering all factors.
        
        Parameters:
            distance_km: Distance in kilometers
            order_total: Total order amount in UGX
            user_tier: Customer loyalty tier (Bronze, Silver, Gold, Platinum)
            is_peak_hours: Whether delivery is during peak hours
            weather_condition: Current weather conditions
        """
        # Base calculation
        base_fee = self._calculate_base_fee(distance_km)
        
        # Apply order total modifiers
        if order_total >= self.MIN_ORDER_FOR_FREE_DELIVERY:
            final_fee = 0
            status = "FREE_DELIVERY"
        elif order_total >= self.MIN_ORDER_FOR_DISCOUNT:
            final_fee = base_fee * (1 - self.DISCOUNT_PERCENTAGE)
            status = "DISCOUNTED"
        else:
            final_fee = base_fee
            status = "STANDARD"

        # Apply user tier discounts
        tier_discount = self._apply_tier_discount(final_fee, user_tier)
        final_fee = final_fee * (1 - tier_discount)

        # Apply time and weather modifiers
        final_fee = self._apply_time_modifier(final_fee, is_peak_hours)
        final_fee = self._apply_weather_modifier(final_fee, weather_condition)

        # Ensure fee stays within bounds
        final_fee = min(max(final_fee, self.MIN_DELIVERY_FEE), self.MAX_DELIVERY_FEE)

        return {
            "base_fee": base_fee,
            "final_fee": round(final_fee),
            "status": status,
            "savings": round(base_fee - final_fee),
            "applied_modifiers": self._get_applied_modifiers(
                order_total, user_tier, is_peak_hours, weather_condition
            )
        }

    def _calculate_base_fee(self, distance_km: float) -> float:
        """Calculate the base delivery fee based on distance."""
        return distance_km * self.BASE_RATE_PER_KM

    def _apply_tier_discount(self, fee: float, user_tier: str) -> float:
        """Apply discount based on user loyalty tier."""
        tier_discounts = {
            "Bronze": 0.0,
            "Silver": 0.1,  # 10% discount
            "Gold": 0.15,   # 15% discount
            "Platinum": 0.2 # 20% discount
        }
        return tier_discounts.get(user_tier, 0.0)

    def _apply_time_modifier(self, fee: float, is_peak_hours: bool) -> float:
        """Adjust fee based on delivery time."""
        if is_peak_hours:
            return fee * 1.2  # 20% increase during peak hours
        return fee

    def _apply_weather_modifier(self, fee: float, weather: str) -> float:
        """Adjust fee based on weather conditions."""
        weather_modifiers = {
            "Rain": 1.3,    # 30% increase in rain
            "Storm": 1.5,   # 50% increase in storm
            "Normal": 1.0   # No modification for normal weather
        }
        return fee * weather_modifiers.get(weather, 1.0)

    def _get_applied_modifiers(self, order_total: float, user_tier: str,
                             is_peak_hours: bool, weather: str) -> list:
        """Get list of all modifiers applied to the delivery fee."""
        modifiers = []
        
        if order_total >= self.MIN_ORDER_FOR_FREE_DELIVERY:
            modifiers.append("Free delivery qualified")
        elif order_total >= self.MIN_ORDER_FOR_DISCOUNT:
            modifiers.append(f"{int(self.DISCOUNT_PERCENTAGE * 100)}% discount applied")

        if user_tier != "Bronze":
            modifiers.append(f"{user_tier} tier discount applied")

        if is_peak_hours:
            modifiers.append("Peak hours surcharge")

        if weather != "Normal":
            modifiers.append(f"{weather} weather adjustment")

        return modifiers
```

## Implementation Examples

```python
# Example usage scenarios
calculator = DeliveryFeeCalculator()

# Scenario 1: Standard delivery
standard_delivery = calculator.calculate_fee(
    distance_km=5,
    order_total=50000,
    user_tier="Bronze",
    is_peak_hours=False,
    weather_condition="Normal"
)
# Result: Base calculation of 5000 UGX (5km * 1000 UGX)

# Scenario 2: Free delivery qualification
free_delivery = calculator.calculate_fee(
    distance_km=8,
    order_total=250000,  # Above free delivery threshold
    user_tier="Silver",
    is_peak_hours=False,
    weather_condition="Normal"
)
# Result: 0 UGX (Free delivery)

# Scenario 3: Discounted delivery
discounted_delivery = calculator.calculate_fee(
    distance_km=6,
    order_total=150000,  # Above discount threshold
    user_tier="Gold",
    is_peak_hours=False,
    weather_condition="Normal"
)
# Result: 50% off base fee + 15% Gold tier discount

# Scenario 4: Peak hours with weather condition
peak_weather_delivery = calculator.calculate_fee(
    distance_km=4,
    order_total=75000,
    user_tier="Bronze",
    is_peak_hours=True,
    weather_condition="Rain"
)
# Result: Base fee + 20% peak hours + 30% weather modifier
```

## Special Conditions for Fee Waiver

```python
class DeliveryWaiverChecker:
    """
    Checks if an order qualifies for delivery fee waiver based on special conditions.
    """
    def check_waiver_eligibility(self, order: dict, user: dict) -> dict:
        """
        Check if order qualifies for delivery fee waiver.
        """
        reasons = []
        
        # New customer first order
        if user.get("total_orders") == 0:
            reasons.append("First-time customer welcome offer")
            return {"waived": True, "reason": reasons}

        # Special promotion periods
        if self._is_promotion_period():
            reasons.append("Ongoing promotion period")
            return {"waived": True, "reason": reasons}

        # Loyalty program milestone
        if self._is_loyalty_milestone(user):
            reasons.append("Loyalty program milestone achieved")
            return {"waived": True, "reason": reasons}

        # Previous delivery issues
        if self._had_recent_delivery_issues(user):
            reasons.append("Compensation for previous delivery issue")
            return {"waived": True, "reason": reasons}

        # Large order history
        if self._check_order_history_qualification(user):
            reasons.append("Frequent customer benefit")
            return {"waived": True, "reason": reasons}

        return {"waived": False, "reason": []}

    def _is_promotion_period(self) -> bool:
        """Check if current date falls within promotion period."""
        # Implementation for checking promotion periods
        pass

    def _is_loyalty_milestone(self, user: dict) -> bool:
        """Check if user has reached a loyalty program milestone."""
        # Implementation for checking loyalty milestones
        pass

    def _had_recent_delivery_issues(self, user: dict) -> bool:
        """Check if user experienced delivery issues recently."""
        # Implementation for checking recent delivery issues
        pass

    def _check_order_history_qualification(self, user: dict) -> bool:
        """Check if user qualifies based on order history."""
        # Implementation for checking order history
        pass
```

## Delivery Zones and Base Rates

```python
class DeliveryZoneManager:
    """
    Manages delivery zones and their specific rates or rules.
    """
    def __init__(self):
        self.zones = {
            "central_kampala": {
                "base_rate": 800,  # Lower rate for central areas
                "min_fee": 4000,
                "areas": ["Nakasero", "Kololo", "Old Kampala"]
            },
            "inner_suburbs": {
                "base_rate": 1000,  # Standard rate
                "min_fee": 5000,
                "areas": ["Ntinda", "Bukoto", "Naguru"]
            },
            "outer_suburbs": {
                "base_rate": 1200,  # Higher rate for outer areas
                "min_fee": 6000,
                "areas": ["Namugongo", "Kyaliwajjala", "Kira"]
            }
        }

    def get_zone_rate(self, delivery_area: str) -> dict:
        """Get the delivery rate information for a specific area."""
        for zone, info in self.zones.items():
            if delivery_area in info["areas"]:
                return {
                    "zone": zone,
                    "base_rate": info["base_rate"],
                    "min_fee": info["min_fee"]
                }
        return None
```

This delivery fee calculation system provides a flexible and fair approach to delivery pricing while encouraging larger orders and rewarding customer loyalty. The system accounts for various factors that might affect delivery costs and provides clear communication about fees and discounts to users.

The implementation includes special conditions for fee waivers, making it possible to use delivery pricing as a tool for customer retention and satisfaction. The zone-based system also allows for more accurate pricing based on specific areas of Kampala.


# CBD Product App Color Scheme

This color scheme is designed to evoke wellness, natural elements, and premium quality while maintaining a modern aesthetic suitable for a CBD product application.

## Primary Colors

### Sage Green
- Hex: `#7C9082`
- Usage: Main brand color, primary buttons, key UI elements
- Represents: Natural origins, organic quality, wellness

### Warm White
- Hex: `#F8F6F3`
- Usage: Background color, content areas
- Represents: Cleanliness, clarity, approachability

### Deep Navy
- Hex: `#1B2D45`
- Usage: Important UI elements, primary text
- Represents: Professionalism, trust, stability

## Accent Colors

### Lavender Mist
- Hex: `#E0E4ED`
- Usage: Secondary elements, hover states
- Represents: Calmness, relaxation

### Golden Hemp
- Hex: `#D4B59D`
- Usage: Highlights, decorative elements
- Represents: Natural hemp fibers, warmth

### Fresh Mint
- Hex: `#A8C5B4`
- Usage: Success states, progress indicators
- Represents: Freshness, positive actions

## Supporting Colors

### Stone Grey
- Hex: `#8C8985`
- Usage: Secondary text, inactive states
- Represents: Subtlety, neutral information

### Cloud White
- Hex: `#FFFFFF`
- Usage: Cards, overlays, pop-ups
- Represents: Clarity, premium feel

### Charcoal
- Hex: `#2C3338`
- Usage: Primary text, icons
- Represents: Readability, emphasis

## Usage Guidelines

1. **Contrast & Accessibility**
   - Ensure text maintains WCAG 2.1 AA standard contrast ratios
   - Use Deep Navy or Charcoal for primary text on light backgrounds
   - Use Cloud White or Warm White for text on dark backgrounds

2. **Hierarchy**
   - Primary actions: Sage Green
   - Secondary actions: Lavender Mist
   - Tertiary actions: Stone Grey

3. **Content Areas**
   - Main background: Warm White
   - Cards and elevated elements: Cloud White
   - Accent sections: Lavender Mist or Fresh Mint (used sparingly)

4. **States**
   - Hover: Darken the base color by 10%
   - Active: Darken the base color by 15%
   - Disabled: Use Stone Grey at 50% opacity

5. **Special Considerations**
   - Limit the use of accent colors to 10-15% of any given screen
   - Maintain adequate padding around colored elements
   - Use color to guide users through the interface hierarchy
   - Ensure color is not the only means of conveying information

## Implementation Notes

- Use CSS custom properties (variables) to maintain consistency
- Include hover and active states in your design system
- Consider dark mode alternatives for each color
- Test color combinations thoroughly for accessibility
- Maintain documentation of color usage in the design system

## Future Considerations

- Prepare alternative color schemes for seasonal promotions
- Consider color-blind friendly variations
- Document color application in different contexts
- Plan for potential brand evolution




Implementation Guide - Multi-Vendor Wallet System
Project Overview
Implementation guide for a wallet-based payment system managing transactions between customers, vendors, and platform in Kampala, with integrated commission handling and mobile money integration.
Development Guidelines for Cursor AI
Step 1: Project Setup
bashCopy# Initialize a new Node.js project
npm init -y

# Install core dependencies
npm install express pg redis amqplib dotenv jsonwebtoken bcrypt cors helmet
Step 2: Project Structure
Generate the following folder structure:
Copysrc/
├── config/
│   ├── database.js
│   └── redis.js
├── models/
│   ├── Wallet.js
│   └── Transaction.js
├── services/
│   ├── WalletService.js
│   ├── TransactionService.js
│   └── MobileMoneyService.js
├── controllers/
│   ├── WalletController.js
│   └── TransactionController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
└── routes/
    ├── wallet.js
    └── transaction.js
Step 3: Core Components Implementation
Database Schema Implementation
sqlCopy-- Guide Cursor to create these tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    warning_count INT DEFAULT 0,
    last_warning_date TIMESTAMP,
    suspension_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    warning_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    issued_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP
);

CREATE TABLE suspensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    issued_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    balance DECIMAL(10,2) DEFAULT 0.00,
    wallet_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_wallet_id UUID REFERENCES wallets(id),
    destination_wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    type VARCHAR(20) NOT NULL,
    reference_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Step 4: Key Implementation Points
1. Wallet Service Implementation
Guide Cursor to implement these core functions:
javascriptCopy// WalletService.js
class WalletService {
    async createWallet(userId, walletType) {
        // Implementation for wallet creation
    }

    async getBalance(walletId) {
        // Implementation for balance checking
    }

    async processTransaction(sourceWalletId, destinationWalletId, amount) {
        // Implementation for transaction processing with commission
    }

    async deposit(walletId, amount) {
        // Implementation for deposits
    }

    async withdraw(walletId, amount) {
        // Implementation for withdrawals
    }
}
2. Transaction Processing
Guide Cursor to implement the transaction flow:
javascriptCopy// TransactionService.js
class TransactionService {
    async createTransaction(sourceWalletId, destinationWalletId, amount) {
        // Start transaction
        // 1. Check source wallet balance
        // 2. Calculate commission (10%)
        // 3. Split payment
        // 4. Update wallets
        // 5. Create transaction record
        // Commit transaction
    }
}
3. Mobile Money Integration
Guide Cursor to implement the integration layer:
javascriptCopy// MobileMoneyService.js
class MobileMoneyService {
    async processDeposit(phoneNumber, amount) {
        // Implementation for mobile money deposit
    }

    async processWithdrawal(phoneNumber, amount) {
        // Implementation for mobile money withdrawal
    }
}
Step 5: API Endpoints Implementation
Guide Cursor to implement these REST endpoints:
javascriptCopy// routes/wallet.js
router.post('/create', walletController.createWallet);
router.get('/:id/balance', walletController.getBalance);
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);

// routes/transaction.js
router.post('/create', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.get('/history/:walletId', transactionController.getTransactionHistory);
Step 6: Security Implementation
Guide Cursor to implement these security measures:
javascriptCopy// middleware/auth.js
const authenticate = async (req, res, next) => {
    // JWT verification implementation
};

// middleware/validation.js
const validateTransaction = async (req, res, next) => {
    // Transaction validation implementation
};
Testing Guidelines
Guide Cursor to implement tests for:
javascriptCopy// tests/wallet.test.js
describe('Wallet Service', () => {
    test('should create new wallet', async () => {
        // Test implementation
    });
    
    test('should process transaction with commission', async () => {
        // Test implementation
    });
});
Error Handling
Guide Cursor to implement proper error handling:
javascriptCopy// utils/errors.js
class WalletError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

// Example usage in services
if (insufficientFunds) {
    throw new WalletError('Insufficient funds', 'INSUFFICIENT_FUNDS');
}
Environment Variables Template
Guide Cursor to use this .env template:
envCopyNODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/wallet_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
MOBILE_MONEY_API_KEY=your_api_key
Implementation Notes for Cursor

Transaction Atomicity

Use PostgreSQL transactions for all wallet operations
Implement proper rollback mechanisms
Handle edge cases and race conditions


Performance Optimization

Implement caching for frequent queries
Use database indexes appropriately
Implement connection pooling


Security Considerations

Implement rate limiting
Use parameterized queries
Implement proper input validation
Use secure password hashing


Mobile Money Integration

Handle timeout scenarios
Implement webhook handlers
Store transaction references
Implement reconciliation processes



Deployment Guidelines

Database Setup

bashCopy# Create database
createdb wallet_db

# Run migrations
npm run migrate

Environment Configuration

bashCopy# Set up environment variables
cp .env.example .env

Application Deployment

bashCopy# Build application
npm run build

# Start application
npm start
Monitoring and Logging
Guide Cursor to implement:

Transaction Monitoring

Log all transactions
Monitor system performance
Track error rates
Monitor API response times


Alerting System

Set up alerts for failed transactions
Monitor system resources
Track suspicious activities



Step 7: User Management and Compliance System
User Management Service Implementation
Guide Cursor to implement these compliance functions:
javascriptCopy// UserManagementService.js
class UserManagementService {
    async issueWarning(userId, warningType, description, issuedBy) {
        // Implementation for issuing warnings
        // 1. Create warning record
        // 2. Update user warning count
        // 3. Send notification
        // 4. Check if action needed based on warning count
    }

    async suspendUser(userId, reason, duration, issuedBy) {
        // Implementation for user suspension
        // 1. Create suspension record
        // 2. Update user status
        // 3. Handle active transactions
        // 4. Send notification
    }

    async removeUser(userId, reason, issuedBy) {
        // Implementation for user removal
        // 1. Archive user data
        // 2. Handle wallet balance
        // 3. Cancel active transactions
        // 4. Send notification
    }

    async reinstateSuspendedUser(userId, issuedBy) {
        // Implementation for reinstating suspended users
    }
}
Compliance Management Routes
Guide Cursor to implement these endpoints:
javascriptCopy// routes/compliance.js
router.post('/warning/issue', complianceController.issueWarning);
router.post('/user/suspend', complianceController.suspendUser);
router.post('/user/remove', complianceController.removeUser);
router.get('/warnings/:userId', complianceController.getUserWarnings);
router.get('/suspension/status/:userId', complianceController.getSuspensionStatus);
Automated Compliance Checks
Guide Cursor to implement automated monitoring:
javascriptCopy// services/ComplianceMonitoringService.js
class ComplianceMonitoringService {
    async checkTransactionPatterns(userId) {
        // Implementation for monitoring suspicious patterns
    }

    async checkUserReports(userId) {
        // Implementation for handling user reports
    }

    async automatedWarningCheck() {
        // Implementation for automated warning system
    }
}
Compliance Middleware
Guide Cursor to implement compliance checks:
javascriptCopy// middleware/compliance.js
const checkUserStatus = async (req, res, next) => {
    // Check if user is suspended or removed
    // Block actions if necessary
};

const validateTransactionCompliance = async (req, res, next) => {
    // Check transaction against compliance rules
};
Compliance Triggers and Actions

Warning Triggers:

Multiple failed transactions
User reports
Suspicious activity patterns
Policy violations


Suspension Triggers:

Multiple warnings (e.g., 3 warnings in 30 days)
Serious policy violations
Suspicious transaction patterns
Failed KYC verification


Removal Triggers:

Multiple suspensions
Fraudulent activity
Severe policy violations
Legal requirements



Compliance Notification System
javascriptCopy// services/NotificationService.js
class NotificationService {
    async sendWarningNotification(userId, warningDetails) {
        // Implementation for warning notifications
    }

    async sendSuspensionNotification(userId, suspensionDetails) {
        // Implementation for suspension notifications
    }

    async sendRemovalNotification(userId, removalDetails) {
        // Implementation for removal notifications
    }
}
Next Steps

Implement basic wallet functionality
Add transaction processing
Integrate mobile money
Implement security measures
Add monitoring and logging
Deploy MVP version
Gather feedback and iterate

Remember to maintain proper error handling, logging, and transaction management throughout the implementation.




Delivery Driver System Implementation Guide
System Overview
A location-based delivery management system integrating customer orders, vendor selection, and driver dispatch with real-time location tracking.
Core Components
1. Location Management System
Customer Location Handling
sqlCopyCREATE TABLE customer_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES users(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    accuracy_meters DECIMAL(5,2),
    location_type VARCHAR(20), -- 'GPS', 'NETWORK', 'MANUAL'
    address_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendor_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES users(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    service_radius_km DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES users(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    accuracy_meters DECIMAL(5,2),
    heading DECIMAL(5,2),
    speed_kmh DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    driver_id UUID REFERENCES users(id),
    status VARCHAR(20), -- 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    pickup_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT
);
2. Driver App Features
Location Tracking Service
javascriptCopy// services/LocationTrackingService.js
class LocationTrackingService {
    async updateDriverLocation(driverId, locationData) {
        // 1. Validate location data
        // 2. Update driver_locations table
        // 3. Broadcast location update to relevant subscribers
        // 4. Check for geofence triggers
    }

    async startTracking(driverId) {
        // Initialize background location tracking
    }

    async stopTracking(driverId) {
        // Stop background location tracking
    }
}
Navigation Service
javascriptCopy// services/NavigationService.js
class NavigationService {
    async getRouteToCustomer(driverLocation, customerLocation) {
        // 1. Generate optimal route
        // 2. Consider traffic data
        // 3. Return turn-by-turn directions
    }

    async updateETA(deliveryId) {
        // Calculate and update estimated arrival time
    }
}
3. Order Assignment System
Vendor Selection
javascriptCopy// services/VendorSelectionService.js
class VendorSelectionService {
    async findNearestVendors(customerLocation, productId) {
        // 1. Query vendors with product in stock
        // 2. Calculate distances
        // 3. Consider vendor ratings and capacity
        // 4. Return ranked list of vendors
    }

    async notifyVendor(vendorId, orderId) {
        // Send order notification to vendor
    }
}
Driver Assignment
javascriptCopy// services/DriverAssignmentService.js
class DriverAssignmentService {
    async findAvailableDrivers(vendorLocation, maxRadius) {
        // 1. Query active drivers within radius
        // 2. Filter by current load and status
        // 3. Rank by distance and rating
    }

    async assignDelivery(orderId, driverId) {
        // Create delivery assignment
    }
}
4. Privacy and Security
Data Protection
javascriptCopy// middleware/privacy.js
const privacyMiddleware = {
    maskPhoneNumber: (phone) => {
        // Mask middle digits of phone number
    },

    filterCustomerData: (customerData) => {
        // Remove sensitive information
    },

    locationPrecisionControl: (location) => {
        // Adjust location precision based on context
    }
};
Security Measures
javascriptCopy// middleware/security.js
const securityMiddleware = {
    validateLocationAccess: async (req, res, next) => {
        // Verify authorization for location data access
    },

    validateDriverStatus: async (req, res, next) => {
        // Verify driver authentication and active status
    }
};
5. Real-time Communication
WebSocket Implementation
javascriptCopy// services/WebSocketService.js
class WebSocketService {
    async broadcastLocationUpdate(driverId, location) {
        // Broadcast to relevant subscribers
    }

    async sendDeliveryUpdate(orderId, status) {
        // Send delivery status updates
    }
}
API Endpoints
Driver API
javascriptCopy// routes/driver.js
router.post('/location/update', driverController.updateLocation);
router.post('/delivery/accept', driverController.acceptDelivery);
router.post('/delivery/pickup', driverController.confirmPickup);
router.post('/delivery/complete', driverController.completeDelivery);
router.get('/navigation/:orderId', driverController.getNavigationDetails);
Customer API
javascriptCopy// routes/customer.js
router.get('/order/track/:orderId', customerController.trackOrder);
router.post('/order/location/update', customerController.updateDeliveryLocation);
router.get('/driver/details/:orderId', customerController.getDriverDetails);
Implementation Considerations
1. Location Accuracy

Implement GPS accuracy threshold checks
Use multiple location sources (GPS, Network, IP)
Implement location verification algorithms
Handle poor GPS signal scenarios

2. Battery Optimization

Implement intelligent polling intervals
Use geofencing for status updates
Optimize background location tracking
Implement battery-aware location services

3. Network Handling

Implement offline mode capabilities
Queue location updates during poor connectivity
Compress location data for transmission
Handle reconnection scenarios

4. Privacy Considerations

Implement data retention policies
Control location data precision
Mask sensitive customer information
Implement data access controls

Testing Guidelines
Location Testing
javascriptCopydescribe('Location Service', () => {
    test('should update driver location accurately', async () => {
        // Test implementation
    });
    
    test('should handle poor GPS accuracy', async () => {
        // Test implementation
    });
});
Assignment Testing
javascriptCopydescribe('Assignment Service', () => {
    test('should assign nearest available driver', async () => {
        // Test implementation
    });
    
    test('should handle multiple concurrent assignments', async () => {
        // Test implementation
    });
});
Monitoring and Analytics
Metrics to Track

Driver location update frequency
Location accuracy statistics
Assignment response times
Delivery completion rates
Customer satisfaction scores
Battery consumption metrics

Performance Monitoring
javascriptCopy// services/MonitoringService.js
class MonitoringService {
    async trackLocationMetrics(driverId, metrics) {
        // Track location-related performance metrics
    }

    async monitorBatteryImpact(driverId) {
        // Monitor and log battery consumption
    }
}
Error Handling
Location Errors
javascriptCopy// utils/LocationErrorHandler.js
class LocationErrorHandler {
    handleInaccurateLocation(location) {
        // Handle inaccurate location data
    }

    handleLocationTimeout() {
        // Handle location acquisition timeout
    }
}
Future Considerations

Route Optimization

Implement multi-stop routing
Consider traffic patterns
Optimize for fuel efficiency


Advanced Features

Predictive driver assignment
Dynamic pricing based on distance
AR navigation assistance
Voice-guided navigation


Scale Considerations

Horizontal scaling of location services
Geospatial database optimization
Real-time analytics processing



# Social Authentication Implementation Guide

## Overview
Implementation guide for social media authentication with mandatory phone number verification for a mobile application.

## Database Schema

```sql
-- User Authentication Table
CREATE TABLE user_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT false,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Authentication Table
CREATE TABLE social_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_auth(id),
    provider VARCHAR(20) NOT NULL, -- 'GOOGLE', 'FACEBOOK', 'APPLE'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    provider_data JSONB, -- Store additional provider-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- Phone Verification Table
CREATE TABLE phone_verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Dependencies Installation

```bash
# Core dependencies
npm install passport passport-google-oauth20 passport-facebook
npm install @react-native-google-signin/google-signin
npm install @react-native-facebook/facebook-login
npm install @invertase/react-native-apple-authentication
npm install twilio # For SMS verification
npm install jsonwebtoken bcrypt
```

## Implementation Steps

### 1. Social Authentication Configuration

```javascript
// config/socialAuth.js
export const socialAuthConfig = {
    tiktok: {
        clientKey: process.env.TIKTOK_CLIENT_KEY,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET,
        callbackURL: '/auth/tiktok/callback'
    },
    snapchat: {
        clientId: process.env.SNAPCHAT_CLIENT_ID,
        clientSecret: process.env.SNAPCHAT_CLIENT_SECRET,
        callbackURL: '/auth/snapchat/callback'
    },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        callbackURL: '/auth/apple/callback'
    }
};
```

### 2. Phone Verification Service

```javascript
// services/PhoneVerificationService.js
class PhoneVerificationService {
    async sendVerificationCode(phoneNumber) {
        try {
            // Generate 6-digit code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store in database with expiration
            await db.query(`
                INSERT INTO phone_verification (phone_number, verification_code, expires_at)
                VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
            `, [phoneNumber, verificationCode]);

            // Send SMS via Twilio
            await twilioClient.messages.create({
                body: `Your verification code is: ${verificationCode}`,
                to: phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER
            });

            return true;
        } catch (error) {
            console.error('Error sending verification code:', error);
            throw error;
        }
    }

    async verifyCode(phoneNumber, code) {
        try {
            const result = await db.query(`
                SELECT * FROM phone_verification
                WHERE phone_number = $1 
                AND verification_code = $2
                AND expires_at > NOW()
                AND verified = false
                ORDER BY created_at DESC
                LIMIT 1
            `, [phoneNumber, code]);

            if (result.rows.length === 0) {
                throw new Error('Invalid or expired verification code');
            }

            // Mark as verified
            await db.query(`
                UPDATE phone_verification
                SET verified = true
                WHERE id = $1
            `, [result.rows[0].id]);

            return true;
        } catch (error) {
            console.error('Error verifying code:', error);
            throw error;
        }
    }
}
```

### 3. Social Authentication Service

```javascript
// services/SocialAuthService.js
class SocialAuthService {
    async handleSocialAuth(provider, providerData, phoneNumber) {
        try {
            // Start transaction
            await db.query('BEGIN');

            // Check if phone is verified
            const phoneVerified = await this.checkPhoneVerification(phoneNumber);
            if (!phoneVerified) {
                throw new Error('Phone number must be verified first');
            }

            // Check if user exists
            let user = await this.findUserByPhone(phoneNumber);
            
            if (!user) {
                // Create new user
                user = await this.createUser(phoneNumber, providerData.email);
            }

            // Update or create social auth entry
            await this.upsertSocialAuth(user.id, provider, providerData);

            await db.query('COMMIT');
            return user;

        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }

    async findUserByPhone(phoneNumber) {
        const result = await db.query(`
            SELECT * FROM user_auth WHERE phone_number = $1
        `, [phoneNumber]);
        return result.rows[0];
    }

    async createUser(phoneNumber, email) {
        const result = await db.query(`
            INSERT INTO user_auth (phone_number, email, phone_verified)
            VALUES ($1, $2, true)
            RETURNING *
        `, [phoneNumber, email]);
        return result.rows[0];
    }

    async upsertSocialAuth(userId, provider, providerData) {
        await db.query(`
            INSERT INTO social_auth (
                user_id, provider, provider_user_id, 
                access_token, refresh_token, token_expires_at, provider_data
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (provider, provider_user_id) 
            DO UPDATE SET
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                token_expires_at = EXCLUDED.token_expires_at,
                provider_data = EXCLUDED.provider_data,
                updated_at = NOW()
        `, [
            userId, provider, providerData.id,
            providerData.accessToken, providerData.refreshToken,
            providerData.expiresAt, providerData
        ]);
    }
}
```

### 4. API Routes

```javascript
// routes/auth.js
router.post('/phone/send-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        await phoneVerificationService.sendVerificationCode(phoneNumber);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/phone/verify', async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        await phoneVerificationService.verifyCode(phoneNumber, code);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/social/login', async (req, res) => {
    try {
        const { provider, providerData, phoneNumber } = req.body;
        const user = await socialAuthService.handleSocialAuth(
            provider, providerData, phoneNumber
        );
        const token = generateJWT(user);
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

### 5. Frontend Implementation (React Native)

```javascript
// components/SocialAuth.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';

export const SocialAuth = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            if (!phoneVerified) {
                throw new Error('Please verify your phone number first');
            }

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            
            // Send to backend
            const response = await api.post('/auth/social/login', {
                provider: 'GOOGLE',
                providerData: userInfo,
                phoneNumber
            });

            // Handle success
            handleAuthSuccess(response.data);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            if (!phoneVerified) {
                throw new Error('Please verify your phone number first');
            }

            const result = await LoginManager.logInWithPermissions([
                'public_profile', 'email'
            ]);

            if (result.isCancelled) {
                throw new Error('User cancelled login');
            }

            const data = await AccessToken.getCurrentAccessToken();
            
            // Send to backend
            const response = await api.post('/auth/social/login', {
                provider: 'FACEBOOK',
                providerData: data,
                phoneNumber
            });

            // Handle success
            handleAuthSuccess(response.data);
        } catch (error) {
            console.error('Facebook login error:', error);
        }
    };

    const handlePhoneVerification = async () => {
        try {
            // Send verification code
            await api.post('/auth/phone/send-code', { phoneNumber });
            // Show verification code input
        } catch (error) {
            console.error('Error sending code:', error);
        }
    };

    const verifyCode = async () => {
        try {
            await api.post('/auth/phone/verify', {
                phoneNumber,
                code: verificationCode
            });
            setPhoneVerified(true);
        } catch (error) {
            console.error('Error verifying code:', error);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <Button
                title="Verify Phone Number"
                onPress={handlePhoneVerification}
            />
            
            {/* Verification code input */}
            <TextInput
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <Button
                title="Verify Code"
                onPress={verifyCode}
            />
            
            {/* Social login buttons */}
            <Button
                title="Continue with Google"
                onPress={handleGoogleLogin}
                disabled={!phoneVerified}
            />
            <Button
                title="Continue with Facebook"
                onPress={handleFacebookLogin}
                disabled={!phoneVerified}
            />
        </View>
    );
};
```

## Security Considerations

1. **Token Management**
   - Implement secure token storage
   - Handle token refresh
   - Implement token revocation

2. **Phone Verification**
   - Rate limit verification attempts
   - Implement timeout between attempts
   - Secure code transmission

3. **Social Auth**
   - Validate social tokens
   - Handle expired credentials
   - Implement proper error handling

## Error Handling

```javascript
// utils/ErrorHandler.js
class AuthError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

// Example usage
if (!phoneVerified) {
    throw new AuthError('Phone verification required', 'PHONE_NOT_VERIFIED');
}
```

## Monitoring and Logging

1. **Track Authentication Metrics**
   - Success/failure rates
   - Provider usage statistics
   - Verification attempt patterns

2. **Security Monitoring**
   - Failed attempt patterns
   - Unusual activity detection
   - Geographic anomalies

## Testing Guidelines

```javascript
describe('Social Authentication', () => {
    test('should require phone verification first', async () => {
        // Test implementation
    });
    
    test('should handle social auth flow', async () => {
        // Test implementation
    });
});
```



Design a comprehensive strategy to develop a world-class mobile app tailored for the Ugandan market. Your strategy should cover everything from environment setup and Git version control to deployment, while keeping the following key requirements in mind:

Key Requirements:
Uganda-Centric Context:

The app must be designed specifically for Uganda's local context.
Currency: Uganda Shillings (UGX) only.
Payment Method: Mobile money (MTN MoMo and Airtel Money) will be the sole payment method for transactions.
Wallet System:
Mobile money will be used exclusively to fund and withdraw from individual wallets.
Wallets will be implemented for all parties: customers, vendors, delivery riders, and store owners.
Store owners must be able to collect commissions from various transactions and transfer them to their own wallets.
User Experience and Innovation:

The app should be designed with an emphasis on superior user experience, usability, and innovation.
Make this app a standout in the market—prioritize features that enhance convenience, speed, and satisfaction.
Focus on delivering a frictionless experience across all touchpoints, ensuring the app is intuitive for a wide range of users.
AI Support System:

Implement advanced AI capabilities to enhance the app's functionality and user experience.
This can include smart recommendations, predictive features, chatbots, personalized experiences, and more.
Core Features:

Focus on the user profiles—individual accounts that securely store data for customers, vendors, riders, and store owners.
Wallet Integration: Secure and seamless integration for mobile money deposits, withdrawals, and transaction tracking.
Wishlists: Allow users to create and manage wishlists to enhance their shopping experience.
Notifications & Updates: Provide timely updates on orders, wallet activity, and promotions.
Store Commission System: Ensure that store owners can track and manage their commissions from transactions.
Scalability & Performance:

Ensure the app is optimized for both performance and scalability, considering future growth and user base expansion.
Objective:
Develop a strategy that not only guides the entire development cycle—from environment setup and Git management to deployment—but also ensures the final product meets high standards of quality, innovation, and user-centric design.

user login and registration is strictly using ugandan phone numbers and mobile money numbers. (add phone number verification and mobile money number verification)
## Next Steps

1. Implement basic phone verification
2. Set up social authentication providers
3. Create user interface
4. Implement security measures
5. Add monitoring and logging
6. Test thoroughly
7. Deploy and monitor

Remember to handle edge cases and maintain proper security throughout the implementation.

under the logo urban herb, add a tagline that says "you bake?, this is the app for you, tell a fellow baker the goodnews!(share appap)"
```

## Prometheus Monitoring Requirements

### Store Function Monitoring
The following store functions need to be monitored in Prometheus:

1. Authentication Functions
   - Login attempts
   - Registration attempts
   - Password resets
   - Session management

2. Product Management Functions
   - Product creation
   - Product updates
   - Product deletions
   - Inventory updates

3. Order Management Functions
   - Order creation
   - Order status updates
   - Order fulfillment
   - Payment processing

4. User Management Functions
   - User profile updates
   - User preferences
   - Address management
   - Account status changes

5. Search and Filtering Functions
   - Search queries
   - Filter applications
   - Sort operations
   - Results pagination

Each function should track:
- Success/failure rates
- Response times
- Error counts
- Usage frequency
- Resource utilization