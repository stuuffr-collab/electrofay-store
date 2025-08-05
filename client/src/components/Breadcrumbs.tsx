import { Link } from "wouter";
import { ChevronLeft, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-400 mb-6">
      <Link href="/" className="flex items-center hover:text-electric-yellow transition-colors">
        <Home className="w-4 h-4 ml-1" />
        الرئيسية
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 space-x-reverse">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
          {item.href ? (
            <Link href={item.href} className="hover:text-electric-yellow transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}