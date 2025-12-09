# FashionKart - Modern E-commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components. Inspired by Myntra's design language with a fashion-forward approach.

## Features

- 🛍️ **Complete E-commerce Flow**: Product browsing, cart management, checkout, and order tracking
- 🎨 **Modern Design**: Fashion-forward UI with fuchsia/pink accents and clean aesthetics
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔐 **Authentication**: Login, register, OAuth (Google/Facebook), and password reset
- 🛒 **Shopping Cart**: Persistent cart with localStorage and server sync
- 🔍 **Advanced Filtering**: Category, brand, price, size, color filters with URL state
- 💳 **Checkout**: Complete checkout flow with address management
- 📦 **Order Management**: View, update, and cancel orders
- ♿ **Accessible**: Built with accessibility best practices
- ⚡ **Performance**: Optimized with Next.js 14 App Router and React Query

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Authentication**: Cookie-based with backend integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:8080` (or set `NEXT_PUBLIC_API_BASE_URL`)

### Installation

1. Clone or download the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set environment variables (optional):
   \`\`\`bash
   # .env.local
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Integration

The frontend integrates with your Express.js backend through the following API endpoints:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/verifyotp` - OTP verification
- `POST /api/forgetPassword/:token` - Password reset
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/logout` - Logout

### Consumer APIs
- `GET /api/consumer/products` - Fetch products (with filters)
- `POST /api/consumer/placeorder` - Place order
- `GET /api/consumer/getallorders` - Get user orders
- `PUT /api/consumer/updateorder/:id` - Update order
- `DELETE /api/consumer/cancleorder/:id` - Cancel order
- `POST /api/getordersdetails` - Get detailed orders with filters

### CORS & Cookies

The frontend sends all requests with `credentials: 'include'` to handle authentication cookies. Make sure your backend:

1. Sets CORS to allow credentials from your frontend domain
2. Sets the `authtoken` cookie after successful login/OAuth
3. Validates the cookie on protected routes

## Project Structure

\`\`\`
app/
├── (store)/                 # Store layout group
│   ├── layout.tsx          # Store layout with header/footer
│   ├── page.tsx            # Home page
│   ├── products/           # Product listing and details
│   ├── login/              # Authentication pages
│   ├── checkout/           # Checkout flow
│   ├── orders/             # Order management
│   └── available/          # OAuth landing page
├── globals.css             # Global styles
└── layout.tsx              # Root layout

components/
├── ui/                     # shadcn/ui components
├── header.tsx              # Main navigation
├── footer.tsx              # Site footer
├── product-card.tsx        # Product display card
├── cart-drawer.tsx         # Shopping cart sidebar
└── filters-sheet.tsx       # Product filters

lib/
├── api-client.ts           # HTTP client with auth
├── types.ts                # TypeScript definitions
└── utils.ts                # Utility functions

context/
├── auth-context.tsx        # Authentication state
└── cart-context.tsx        # Shopping cart state
\`\`\`

## Key Features

### Authentication Flow
- Login/Register with validation
- OAuth integration (Google/Facebook)
- Password reset with email tokens
- Persistent auth state with cookies

### Shopping Experience
- Product grid with infinite scroll
- Advanced filtering and search
- Product detail pages with image gallery
- Size selection and quantity management
- Persistent shopping cart

### Checkout & Orders
- Multi-step checkout with address management
- Payment integration (opens payment links)
- Order tracking and management
- Order history with detailed filtering

### Design System
- Consistent color palette with fuchsia primary
- Responsive grid layouts
- Hover animations and micro-interactions
- Accessible form controls and navigation
- Loading states and error handling

## Customization

### Colors
Update the color scheme in `app/globals.css`:
\`\`\`css
:root {
  --primary: 322 84% 60%; /* Fuchsia */
  /* Add your brand colors */
}
\`\`\`

### API Base URL
Set your backend URL:
\`\`\`bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
\`\`\`

### Branding
- Replace logo in `components/header.tsx`
- Update site name and metadata in `app/layout.tsx`
- Customize hero section in `app/(store)/page.tsx`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set `NEXT_PUBLIC_API_BASE_URL` environment variable

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test on mobile and desktop
5. Ensure accessibility compliance

## License

This project is for educational and development purposes.
