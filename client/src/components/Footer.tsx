import { Phone, MapPin, Clock, Zap, MessageCircle, Facebook, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-dark-bg text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-4 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-electric-yellow" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-electric-yellow">إلكتروفاي</h4>
                <p className="text-sm text-gray-400">Electrofy Store</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              أفضل متجر لإكسسوارات القيمنج والمنتجات الكهرومنزلية في ليبيا
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://wa.me/218922569912"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold mb-4">روابط سريعة</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  العروض
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold mb-4">الفئات</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=gaming" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  إكسسوارات قيمنج
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  منتجات كهرومنزلية
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  إكسسوارات هواتف
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-yellow transition-colors">
                  شواحن وكابلات
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-bold mb-4">معلومات التواصل</h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-electric-yellow" />
                <span className="text-gray-300">+218922569912</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-electric-yellow" />
                <span className="text-gray-300">جميع مدن ليبيا</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-5 h-5 text-electric-yellow" />
                <span className="text-gray-300">24/7 خدمة العملاء</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 إلكتروفاي - Electrofy Store. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-gray-500 mt-2">صممت بحب في ليبيا ❤️</p>
        </div>
      </div>
    </footer>
  );
}
