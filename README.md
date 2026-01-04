# E-commerce Ordering and Payment System - Frontend

A modern, responsive e-commerce frontend built with Next.js 16, featuring seamless payment integration, real-time cart management, and an intuitive admin dashboard.

## 🔗 Quick Links

- **Live Demo**: [https://e-commerce-ordering-and-payment-sys-one.vercel.app](https://e-commerce-ordering-and-payment-sys-one.vercel.app)
- **Frontend Repo**: [GitHub](https://github.com/mohamim360/E-commerce-Ordering-and-Payment-System-Frontend)
- **Backend Repo**: [GitHub](https://github.com/mohamim360/E-commerce-Ordering-and-Payment-System)

## 🚀 Features

### Customer Features
- **Product Browsing**: Paginated product catalog with search and filtering
- **Shopping Cart**: Real-time cart updates with persistent state (Zustand)
- **User Authentication**: Secure login/registration with JWT tokens
- **Order Management**: View order history with detailed breakdowns
- **Payment Options**: 
  - Stripe integration for card payments
  - bKash support for mobile wallet payments
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Inventory Control**: Real-time stock management
- **Product Status**: Activate/deactivate products
- **Modal Forms**: Intuitive product creation and editing

### Technical Features
- **Server Components**: Leveraging Next.js 16 App Router
- **Client State**: Zustand for global state management
- **Optimistic Updates**: Instant UI feedback
- **Error Handling**: Toast notifications with react-hot-toast
- **Type Safety**: Full TypeScript implementation
- **Icon System**: Lucide React icons

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Payments**: Stripe React SDK
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- Running backend API (see backend repository)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mohamim360/E-commerce-Ordering-and-Payment-System-Frontend.git
cd E-commerce-Ordering-and-Payment-System-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start frontend
docker-compose up -d frontend

# View logs
docker-compose logs -f frontend

# Stop service
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t ecommerce-frontend .

# Run container
docker run -p 3000:3000 --env-file .env.local ecommerce-frontend
```

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with Navbar
│   ├── page.tsx               # Home page
│   ├── login/page.tsx         # Login page
│   ├── register/page.tsx      # Registration page
│   ├── products/page.tsx      # Product listing
│   ├── cart/page.tsx          # Shopping cart
│   ├── orders/page.tsx        # Order history
│   ├── checkout/[orderId]/page.tsx  # Checkout page
│   └── admin/
│       └── products/page.tsx  # Admin product management
├── components/
│   └── Navbar.tsx             # Navigation component
├── lib/
│   ├── api.ts                 # API client configuration
│   └── store.ts               # Zustand store definitions
└── types/
    └── index.ts               # TypeScript type definitions
```

## 🎨 Key Components

### Navigation (Navbar)
- Responsive header with logo and navigation links
- User authentication status
- Shopping cart badge with item count
- Role-based menu items (Admin access)

### Product List
- Grid layout with responsive columns
- Add to cart functionality
- Stock status indicators
- Pagination controls

### Shopping Cart
- Item quantity management
- Real-time total calculation
- Remove items functionality
- Checkout button

### Checkout Flow
1. Cart review
2. Order creation
3. Payment method selection
4. Stripe/bKash payment processing
5. Order confirmation

### Admin Dashboard
- Product table with sorting
- Create/Edit/Delete operations
- Modal-based forms
- Status toggle (Active/Inactive)

## 🔐 Authentication Flow

```typescript
// Login
POST /auth/login
→ Receives JWT token
→ Stores in localStorage
→ Updates Zustand auth store
→ Redirects to products

// Protected Routes
→ Checks auth state
→ Validates token via middleware
→ Redirects to login if unauthorized
```

## 🛒 Shopping Flow

1. **Browse Products**: `/products`
2. **Add to Cart**: Click "Add to Cart" button
3. **View Cart**: `/cart` - Review items and quantities
4. **Checkout**: Click "Proceed to Checkout"
5. **Payment**: Choose Stripe or bKash
6. **Confirmation**: Order success page

## 💳 Payment Integration

### Stripe Integration
```typescript
// Stripe Elements
import { Elements, PaymentElement } from '@stripe/react-stripe-js';

// Payment flow
1. Create order → Get clientSecret
2. Display PaymentElement
3. Confirm payment
4. Webhook verifies payment
5. Order marked as PAID
```

### bKash Integration
```typescript
// bKash flow
1. Create order
2. Initiate bKash payment
3. Redirect to bKash gateway
4. User completes payment
5. Callback to app
6. Execute payment API
```

## 📱 Responsive Design

- **Mobile**: Single column layout, hamburger menu
- **Tablet**: 2-column product grid
- **Desktop**: 4-column product grid, full navigation

## 🎯 State Management

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

### Cart Store (Zustand)
```typescript
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}
```

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables (Vercel)

Add in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Alternative Platforms
- **Netlify**: Full Next.js support
- **Railway**: Container-based deployment
- **AWS Amplify**: Serverless deployment

## 🎨 Customization

### Theme Colors
Edit `src/app/globals.css`:
```css
@import "tailwindcss";

/* Add custom styles */
```

### Branding
- Logo: Update `src/components/Navbar.tsx`
- Favicon: Replace `public/` icons
- Meta tags: Update `src/app/layout.tsx`

## 📊 Performance Optimization

- **Next.js Image**: Use `next/image` for optimized images
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: API response caching with SWR (optional)

## 🔧 Configuration

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // For Docker
  images: {
    domains: ['your-cdn-domain.com'],
  },
};
```

### tailwind.config.ts
```typescript
// Extend Tailwind theme
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
    },
  },
}
```

---