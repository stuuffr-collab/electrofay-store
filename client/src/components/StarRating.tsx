import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export function StarRating({ rating, reviewCount = 127, size = 'md', showNumber = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) 
                ? 'fill-electric-yellow text-electric-yellow' 
                : i < Math.ceil(rating) && rating % 1 >= 0.5
                ? 'fill-electric-yellow/50 text-electric-yellow'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      
      {/* Rating Number */}
      {showNumber && (
        <span className={`text-electric-yellow font-bold ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {/* Review Count */}
      {reviewCount && (
        <span className={`text-gray-400 ${textSizeClasses[size]}`}>
          ({reviewCount} تقييم)
        </span>
      )}
    </div>
  );
}