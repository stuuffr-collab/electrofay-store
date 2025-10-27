import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { initGA } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { Layout } from "@/components/Layout";
import { CartProvider } from "@/context/CartContext";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Offers from "@/pages/Offers";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryDetailPage from "@/pages/CategoryDetailPage";

import { AdminOrders } from "@/pages/AdminOrders";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrdersPage from "@/pages/admin/Orders";
import AdminSettings from "@/pages/admin/Settings";

import NotFound from "@/pages/not-found";
import NotFound404 from "@/pages/NotFound404";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  
  return (
    <Switch>
      {/* Admin Routes - These are rendered WITHOUT the main Layout */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      {/* Public Routes - These are rendered WITH the main Layout */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/offers" component={Offers} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/categories/:categoryId" component={CategoryDetailPage} />

      {/* Fallback to 404 */}
      <Route component={NotFound404} />
    </Switch>
  );
}

function PublicRouter() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');
  
  // Don't wrap admin routes with Layout
  if (isAdminRoute) {
    return <Router />;
  }
  
  // Wrap public routes with Layout
  return (
    <Layout>
      <Router />
    </Layout>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <PublicRouter />
          <Toaster />
          <HotToaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '0.5rem',
                fontSize: '14px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
