# Replit.md

## Overview

This is a **production-ready** Arabic e-commerce store called "إلكتروفاي - Electrofy Store" specializing in gaming accessories and home electronics in the Libyan market. The application has been transformed from MVP to a comprehensive platform featuring advanced order management, backend logging, PWA capabilities, and professional documentation. Built with React + Vite frontend, Express.js backend, and includes complete SEO optimization, analytics integration, and comprehensive user experience features.

## Recent Changes (October 7, 2025)

### ✅ **Advanced Category Navigation System** (October 7, 2025)
- **Category Taxonomy** - Created comprehensive category structure with 5 main categories and subcategories in `client/src/lib/categories.ts`
- **Categories Page** - New dedicated `/categories` page showcasing all main categories with modern card design
- **Category Detail Pages** - Dynamic `/categories/:categoryId` pages displaying filtered products by category
- **Advanced Filtering** - Multi-dimensional filtering system supporting price range, subcategory, and brand filters
- **Smart Sorting** - Products can be sorted by popularity, price (low-to-high, high-to-low), and newest additions
- **Framer Motion Animations** - Smooth page transitions and card hover effects for enhanced UX
- **Homepage Integration** - Added categories showcase section on homepage with "View All" CTA
- **Header Navigation** - Integrated categories link in main navigation header
- **Responsive Design** - Fully responsive category cards and filters for mobile, tablet, and desktop
- **Category Metadata** - Each category includes icon, gradient color scheme, description, and subcategory count

### ✅ **Smart Product Categorization System** (September 30, 2025)
- **Intelligent Filtering** - Created keyword-based smart categorization system analyzing product names
- **Four Main Categories** - Products organized into: PC Components, Gaming Peripherals, Setup & Equipment, Accessories
- **Smart Filters Library** - New `client/src/lib/smartFilters.ts` with categorizeProduct function
- **Enhanced User Experience** - Both Home and Products pages now use smart category filters
- **Data Integrity** - Categorization based on product names, no database schema changes needed
- **Comprehensive Coverage** - All 65 products automatically categorized based on bilingual product names

### ✅ **Final Migration to Standard Replit Environment Complete** (August 6, 2025)
- Successfully migrated from Replit Agent to standard environment
- All packages installed and workflow running properly
- Cart system, dark mode, and all features working perfectly
- Fixed SmartSearch component React warning (maximum update depth exceeded)
- Added 5 MSI gaming products (MSI001-MSI005) including motherboard, graphics card, PSU, SSD, and liquid cooler
- Fixed TypeScript errors in useProducts hook
- **Fixed Supabase Environment Variables** - Corrected swapped URL/key with automatic detection and trimming
- **Enhanced Product Specifications** - Clean professional format (Size: 24.5 inches, Resolution: FHD, etc.)

### ✅ **Product Detail Page Enhancement Complete**
- **Enhanced Order Flow** - Professional "Order Now" button with success notifications
- **Improved Star Rating** - Star display with review count and rating numbers
- **Product Specifications Tabs** - Organized tabs for Description, Specifications, and Shipping
- **Similar Products Carousel** - Horizontal scroll with product badges (New, Top Rated, etc.)
- **Product Image Zoom** - Hover zoom functionality with gallery thumbnails
- **Typography Enhancement** - Larger fonts, Cairo/Tajawal font family for titles
- **Performance Optimization** - Smooth animations and responsive design
- **Product Features Update** - Customized features with emojis and concise descriptions

### ✅ **Supabase Database Integration - Phase 1**
- **Supabase Client Setup** - Created secure connection with environment variables
- **Database Schema** - Updated schema to match current product structure and cart items
- **Product Hooks** - useProducts hook with fallback to local data for reliability
- **Order Hooks** - useSaveOrder hook for saving customer orders to database
- **Loading States** - Added skeleton loading and error handling for better UX
- **Database Setup Scripts** - Complete SQL setup with sample data and security policies

### ✅ **Enhanced Order Management**
- **Database Storage** - Orders now saved to Supabase with full customer and item details
- **Dual Backup System** - Orders saved to both database and localStorage for reliability
- **Error Handling** - Graceful fallbacks ensure orders are never lost
- **WhatsApp Integration** - Business owner still receives formatted WhatsApp messages

### ✅ **Gaming-Focused Transformation Complete**
- **Product Categories** - Updated to gaming-only: gaming_accessory, gaming_pc, gaming_console, streaming_gear
- **Database Schema** - Updated to support new gaming categories exclusively
- **Product Catalog** - 12 gaming products: keyboards, mice, headsets, monitors, chairs, webcams, PCs, laptops
- **UI Updates** - All filters and categories now gaming-focused
- **Content Updates** - Hero section and descriptions tailored for gaming audience

### 🔄 **Next Phase: Complete Database Integration**
- Run database setup script in Supabase SQL Editor
- Test product loading from database
- Implement image upload to Supabase Storage
- Add admin dashboard for order management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components built with Radix UI primitives (shadcn/ui)
- **Icons**: Lucide React SVG icons
- **Internationalization**: Arabic RTL support with bilingual content

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with fallback to PostgreSQL sessions
- **Development**: Vite middleware integration for HMR
- **Deployment**: ESBuild bundling for production

## Key Components

### Frontend Components
1. **Layout System**: Header, Footer, and Layout wrapper with RTL support
2. **Product Management**: ProductCard component with lazy loading images
3. **Order Processing**: OrderModal for customer data collection
4. **UI Enhancements**: CountdownTimer, PromotionalTicker
5. **Analytics**: Google Analytics integration with page tracking
6. **Theming**: Dark/Light mode toggle with persistent preferences

### Backend Components
1. **Route Management**: Centralized route registration system
2. **Storage Interface**: Abstracted storage layer (MemStorage implementation)
3. **Development Server**: Vite integration for seamless development experience

### Database Schema
- **Users**: Basic user authentication structure
- **Products**: Complete product catalog with Arabic/English names, pricing, categories, ratings, badges, stock management
- **Orders**: Order tracking with customer information and status management
- **Cities**: Delivery fee structure for Libyan cities

## Data Flow

1. **Product Display**: Static JSON data loaded from `/client/src/data/products.json`
2. **Order Processing**: 
   - Customer fills order modal
   - Data formatted into WhatsApp message
   - Direct WhatsApp link opened for order completion
   - Success toast displayed to customer
3. **Analytics Tracking**: Page views and events tracked via Google Analytics
4. **State Management**: React Query handles server state caching and synchronization

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React Router alternative (Wouter), TanStack Query, React Hook Form
- **UI Framework**: Radix UI primitives, class-variance-authority for styling variants
- **Styling**: Tailwind CSS, custom CSS variables for theming
- **Database**: Drizzle ORM, Neon Database serverless driver, PostgreSQL session store
- **Development**: TypeScript, Vite, ESBuild for production builds

### Third-Party Integrations
- **WhatsApp API**: Direct messaging for order processing
- **Google Analytics**: User behavior tracking and conversion metrics
- **Unsplash**: Product images (placeholder implementation)

## Deployment Strategy

### Development
- Vite development server with HMR
- TypeScript compilation checking
- Hot module replacement for React components
- Drizzle Kit for database schema management

### Production
- Frontend: Vite build output to `/dist/public`
- Backend: ESBuild bundle to `/dist/index.js`
- Database: PostgreSQL with environment-based configuration
- Static Assets: Served through Express static middleware

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `NODE_ENV`: Environment detection for development features

### Database Management
- Drizzle migrations in `/migrations` directory
- Schema definitions in `/shared/schema.ts`
- Push command: `npm run db:push` for schema updates

The application follows a modern full-stack architecture with emphasis on Arabic user experience, WhatsApp-based ordering system, and comprehensive analytics tracking. The modular component structure and TypeScript implementation ensure maintainability and type safety throughout the codebase.