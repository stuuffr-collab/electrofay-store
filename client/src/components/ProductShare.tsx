import { Share2, MessageCircle, Facebook, Twitter } from 'lucide-react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Product } from './ProductCard';

interface ProductShareProps {
  product: Product;
  className?: string;
}

export function ProductShare({ product, className = "" }: ProductShareProps) {
  const shareUrl = `${window.location.origin}/products/${product.id}`;
  const title = `${product.name} - متجر إلكتروفاي`;
  const description = `احصل على ${product.name} بسعر ${product.price} دينار ليبي من متجر إلكتروفاي`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 px-2 ${className}`}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <WhatsappShareButton 
            url={shareUrl} 
            title={title}
            separator=" - "
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span>مشاركة عبر واتساب</span>
          </WhatsappShareButton>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <FacebookShareButton 
            url={shareUrl} 
            hashtag="#إلكتروفاي"
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            <span>مشاركة على فيسبوك</span>
          </FacebookShareButton>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <TwitterShareButton 
            url={shareUrl} 
            title={title}
            hashtags={["إلكتروفاي", "قيمنج", "ليبيا"]}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent"
          >
            <Twitter className="h-4 w-4 text-blue-400" />
            <span>مشاركة على تويتر</span>
          </TwitterShareButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}