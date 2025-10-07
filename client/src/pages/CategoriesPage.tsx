import { motion } from 'framer-motion';
import { categories } from '@/lib/categories';
import { Link } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" data-testid="text-categories-title">
              استكشف الأقسام
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto" data-testid="text-categories-subtitle">
              تصفح مجموعتنا الواسعة من المنتجات التقنية المنظمة في أقسام متخصصة
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-testid={`card-category-${category.id}`}
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer h-full">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Icon Background Circle */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300" data-testid={`text-category-name-${category.id}`}>
                        {category.name}
                      </h2>
                      
                      {/* English Name */}
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 font-medium">
                        {category.nameEn}
                      </p>
                      
                      {/* Description */}
                      <p className="text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* Subcategories Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {category.subcategories.length} فئة فرعية
                        </span>
                        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:-translate-x-2 transition-all duration-300" />
                      </div>
                      
                      {/* Subcategories Pills */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub.id}
                            className="px-3 py-1 bg-gray-700/50 dark:bg-gray-800/50 rounded-full text-xs text-gray-300 dark:text-gray-400 border border-gray-600 dark:border-gray-700"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="px-3 py-1 bg-gray-700/50 dark:bg-gray-800/50 rounded-full text-xs text-gray-300 dark:text-gray-400 border border-gray-600 dark:border-gray-700">
                            +{category.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            لم تجد ما تبحث عنه؟
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            تواصل معنا وسنساعدك في العثور على المنتج المثالي لاحتياجاتك
          </p>
          <Link href="/contact">
            <button className="bg-white text-purple-600 dark:bg-gray-900 dark:text-purple-400 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform duration-300" data-testid="button-contact-us">
              تواصل معنا
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
