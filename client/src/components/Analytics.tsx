import { useEffect } from 'react';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initializeGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  // Google Analytics is optional - only initialize if measurement ID is provided
  if (measurementId) {
    ReactGA.initialize(measurementId);
    console.log('Google Analytics initialized');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: 'pageview', page: path, title });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.event({
      action,
      category,
      label,
      value
    });
  }
};

// Custom hooks for tracking
export const usePageTracking = () => {
  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);
};

// Event tracking for e-commerce
export const trackProductView = (productId: string, productName: string, category: string, price: number) => {
  trackEvent('view_item', 'ecommerce', `${productName} (${productId})`, price);
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent('add_to_cart', 'ecommerce', `${productName} (${productId})`, price);
};

export const trackPurchaseIntent = (productId: string, productName: string, price: number) => {
  trackEvent('purchase_intent', 'ecommerce', `${productName} (${productId})`, price);
};

export const trackWhatsAppOpen = (productId: string, productName: string) => {
  trackEvent('whatsapp_open', 'engagement', `${productName} (${productId})`);
};