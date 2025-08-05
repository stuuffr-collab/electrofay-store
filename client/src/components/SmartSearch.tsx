import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Product } from "@/components/ProductCard";

interface SmartSearchProps {
  products: Product[];
  onSearchChange: (query: string, filteredProducts: Product[]) => void;
  placeholder?: string;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  text: string;
  product?: Product;
  highlight?: string;
}

export function SmartSearch({ products, onSearchChange, placeholder = "ابحث عن منتجات..." }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate smart suggestions based on query
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Product name matches
    products.forEach(product => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      
      if (name.includes(query) || description.includes(query)) {
        suggestions.push({
          type: 'product',
          text: product.name,
          product,
          highlight: searchQuery
        });
      }
    });

    // Category suggestions
    const categories = {
      'gaming_accessory': 'إكسسوارات قيمنج',
      'gaming_pc': 'أجهزة PC قيمنج',
      'gaming_console': 'أجهزة ألعاب',
      'streaming_gear': 'أدوات الستريمنج'
    };

    Object.entries(categories).forEach(([key, value]) => {
      if (value.toLowerCase().includes(query) || 
          key.toLowerCase().includes(query) ||
          (query.includes('قيم') && key.includes('gaming')) ||
          (query.includes('pc') && key.includes('pc')) ||
          (query.includes('ستريم') && key.includes('streaming'))) {
        suggestions.push({
          type: 'category',
          text: `${value} - تصنيف`,
          highlight: searchQuery
        });
      }
    });

    // Brand/keyword suggestions
    const keywords = ['RGB', 'ميكانيكي', 'لاسلكي', 'قيمنج', 'احترافي', 'ستريمنج'];
    keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query) || 
          (query.includes('rgb') && keyword === 'RGB') ||
          (query.includes('لاسلك') && keyword === 'لاسلكي')) {
        suggestions.push({
          type: 'brand',
          text: `منتجات ${keyword}`,
          highlight: searchQuery
        });
      }
    });

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  };

  // Filter products based on search query
  const filterProducts = (searchQuery: string): Product[] => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const badges = product.badges?.join(' ').toLowerCase() || '';
      
      return name.includes(query) || 
             description.includes(query) || 
             badges.includes(query) ||
             // Arabic-specific search improvements
             (query.includes('قيم') && (name.includes('gaming') || description.includes('gaming'))) ||
             (query.includes('pc') && (name.includes('pc') || description.includes('كمبيوتر'))) ||
             (query.includes('لوح') && name.includes('keyboard')) ||
             (query.includes('فأر') && name.includes('mouse')) ||
             (query.includes('سماع') && name.includes('headset'));
    });
  };

  // Handle search input changes
  useEffect(() => {
    const filteredProducts = filterProducts(query);
    onSearchChange(query, filteredProducts);

    if (query.trim()) {
      const newSuggestions = generateSuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query, products]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product' && suggestion.product) {
      setQuery(suggestion.product.name);
      onSearchChange(suggestion.product.name, [suggestion.product]);
    } else if (suggestion.type === 'category') {
      const categoryQueries = {
        'إكسسوارات قيمنج': 'إكسسوارات',
        'أجهزة PC قيمنج': 'PC',
        'أجهزة ألعاب': 'ألعاب',
        'أدوات الستريمنج': 'ستريمنج'
      };
      const categoryQuery = Object.entries(categoryQueries).find(([key]) => 
        suggestion.text.includes(key)
      )?.[1] || suggestion.text;
      setQuery(categoryQuery);
    } else {
      setQuery(suggestion.text.replace(' - تصنيف', '').replace('منتجات ', ''));
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearchChange("", products);
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-electric-yellow text-black px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-3 text-right bg-dark-bg border-dark-border text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-yellow focus:border-electric-yellow transition-all duration-200"
          data-testid="search-input"
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700"
            data-testid="clear-search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-dark-border last:border-b-0 ${
                index === selectedIndex 
                  ? 'bg-electric-yellow text-black' 
                  : 'text-white hover:bg-gray-700'
              }`}
              data-testid={`suggestion-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <div className="font-medium">
                    {highlightText(suggestion.text, suggestion.highlight || '')}
                  </div>
                  {suggestion.product && (
                    <div className="text-sm opacity-75 mt-1">
                      {suggestion.product.price.toLocaleString()} د.ل
                    </div>
                  )}
                </div>
                <div className="mr-3 opacity-60">
                  {suggestion.type === 'product' && '🎮'}
                  {suggestion.type === 'category' && '📁'}
                  {suggestion.type === 'brand' && '🏷️'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results Info */}
      {query && (
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-400">
            {filterProducts(query).length > 0 
              ? `تم العثور على ${filterProducts(query).length} منتج`
              : 'لا توجد نتائج'
            }
          </span>
        </div>
      )}
    </div>
  );
}