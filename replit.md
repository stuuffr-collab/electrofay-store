# Replit.md

## Overview

"إلكتروفاي - Electrofy Store" is a production-ready Arabic e-commerce platform specializing in gaming accessories and home electronics for the Libyan market. It features advanced order management, PWA capabilities, comprehensive SEO, and analytics. The platform is built with a React + Vite frontend and an Express.js backend, leveraging Supabase for its database and storage. The project aims to provide a robust and user-friendly online shopping experience, with a focus on real-time synchronization and efficient management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design system, Radix UI primitives (shadcn/ui)
- **Internationalization**: Arabic RTL support with bilingual content
- **UI/UX Decisions**: Dark/Light mode, Framer Motion animations, comprehensive category navigation system, dedicated `/categories` page with dynamic filtering and smart sorting, product detail pages with "Order Now" button, star ratings, specification tabs, similar products carousel, and image zoom. Smart product categorization system based on product names.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL) - Direct API access via Supabase client
- **Admin Panel**: Fully integrated with Supabase for all CRUD operations (products, orders, settings)
- **Storefront**: Uses Supabase for product catalog and dynamic pricing
- **Deployment**: ESBuild bundling for production

### System Design Choices
- **Unified Data Source**: Supabase serves as the single source of truth for both admin and storefront.
- **Real-time Synchronization**: Changes made in the admin panel are immediately reflected on the storefront.
- **Order Management**: Orders are saved to Supabase and locally, with WhatsApp integration for business owner notifications.
- **Authentication**: Admin panel authentication has been removed for direct access (suitable for internal/development use).
- **Dynamic Category System**: Complete category management system with database tables (categories, subcategories), full CRUD operations, and icon mapping utility. Categories are dynamically loaded from database via /api/categories endpoint.
- **Gaming Focus**: Product categories and UI are tailored for gaming accessories and electronics.
- **Admin Panel Features**: Interactive categories page with add/edit/delete functionality, expandable product views, drag-drop support for reordering, and color/gradient customization.

## External Dependencies

- **Supabase**: Used for PostgreSQL database (product catalog, orders, settings), Supabase Storage (product image uploads), and real-time data synchronization.
- **WhatsApp API**: Integrated for direct messaging to facilitate order processing.
- **Google Analytics**: Utilized for user behavior tracking and conversion metrics.
- **React Ecosystem**: Wouter, TanStack Query, React Hook Form.
- **UI Framework**: Radix UI primitives, class-variance-authority.
- **Styling**: Tailwind CSS.