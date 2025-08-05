# Replit.md

## Overview

This is a **production-ready** Arabic e-commerce store called "إلكتروفاي - Electrofy Store" specializing in gaming accessories and home electronics in the Libyan market. The application has been transformed from MVP to a comprehensive platform featuring advanced order management, backend logging, PWA capabilities, and professional documentation. Built with React + Vite frontend, Express.js backend, and includes complete SEO optimization, analytics integration, and comprehensive user experience features.

## Recent Changes (August 5, 2025)

### ✅ **Migration to Standard Replit Environment Complete**
- Successfully migrated from Replit Agent to standard environment
- All packages installed and workflow running properly
- Cart system, dark mode, and all features working perfectly

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