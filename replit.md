# Replit.md

## Overview

This is a **production-ready** Arabic e-commerce store called "إلكتروفاي - Electrofy Store" specializing in gaming accessories and home electronics in the Libyan market. The application has been transformed from MVP to a comprehensive platform featuring advanced order management, backend logging, PWA capabilities, and professional documentation. Built with React + Vite frontend, Express.js backend, and includes complete SEO optimization, analytics integration, and comprehensive user experience features.

## Recent Changes (August 4, 2025)

✅ **Backend API Integration** - Added comprehensive order logging API with Express.js routes
✅ **Advanced Order Experience** - Enhanced OrderModal with backend integration and hot toast notifications  
✅ **Production Features** - PWA manifest, robots.txt, sitemap.xml, and comprehensive SEO meta tags
✅ **404 Page** - Professional NotFound404 component with helpful navigation
✅ **Documentation** - Comprehensive README.md with setup instructions and deployment guide
✅ **Analytics Framework** - Complete Google Analytics integration structure (ready for user's measurement ID)
✅ **Design Enhancements** - New arrivals banner component and marquee animations
✅ **Testimonials Removal** - Completely removed customer testimonials section per user request

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