import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface ProductImageZoomProps {
  images: string[];
  alt: string;
  discountPercentage?: number;
}

export function ProductImageZoom({ images, alt, discountPercentage }: ProductImageZoomProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div className="relative bg-dark-card rounded-2xl p-4 border border-dark-border group">
        <Dialog>
          <DialogTrigger asChild>
            <div className="aspect-square overflow-hidden rounded-xl cursor-zoom-in relative">
              <img
                src={images[selectedImage]}
                alt={alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Discount Badge */}
              {discountPercentage && discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  خصم {discountPercentage}%
                </div>
              )}
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0 bg-black border-dark-border">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={images[selectedImage]}
                alt={alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-200 ${
                selectedImage === index 
                  ? 'border-electric-yellow' 
                  : 'border-dark-border hover:border-gray-500'
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}