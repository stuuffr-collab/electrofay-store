import { Monitor } from "lucide-react";

interface ProductTabsProps {
  description: string;
  descriptionEn: string;
  category: string;
}

export function ProductTabs({ description, descriptionEn, category }: ProductTabsProps) {
  const getSpecifications = (category: string) => {
    switch (category) {
      case 'gaming_accessory':
        return {
          "Size": "24.5 inches",
          "Resolution": "FHD (1920×1080)",
          "Panel Type": "IPS",
          "Refresh Rate": "100Hz",
          "Response Time": "1ms (MPRT) / 4ms (GTG)",
          "Brightness": "300 nits",
          "Ports": "1x DisplayPort 1.2a, 1x HDMI 1.4b, Headphone Jack",
          "VESA Support": "Yes (100x100mm)",
          "Additional Features": "HDR, Blue Light Reduction, Anti-Flicker, Frameless Design, Adjustable Tilt Stand"
        };
      case 'gaming_pc':
        return {
          "Processor": "Intel Core i7-12700K",
          "Graphics Card": "NVIDIA RTX 4070",
          "Memory": "16GB DDR4 3200MHz",
          "Storage": "1TB NVMe SSD",
          "Motherboard": "MSI B660M PRO-VDH",
          "Power Supply": "650W 80+ Gold",
          "Cooling": "RGB Air Cooler",
          "Case": "Mid Tower RGB Case"
        };
      case 'gaming_console':
        return {
          "Connectivity": "Bluetooth 5.0",
          "Battery Life": "40 hours",
          "Compatibility": "PC, PS5, Xbox Series X/S",
          "Vibration": "HD Rumble Technology",
          "Water Resistance": "IPX4 Water Resistant",
          "Buttons": "16 Programmable Buttons",
          "Weight": "280g",
          "Warranty": "2 years"
        };
      case 'streaming_gear':
        return {
          "Audio Quality": "48kHz/16-bit Audio",
          "Connectivity": "USB-C & XLR Output",
          "Noise Cancellation": "AI Noise Reduction",
          "Software": "OBS, Streamlabs Compatible",
          "Pattern": "Cardioid Pickup Pattern",
          "Sensitivity": "-34dB ±2dB",
          "Frequency Range": "20Hz - 20kHz",
          "Compatibility": "Windows, Mac, Linux"
        };
      default:
        return {
          "Warranty": "1 year",
          "Shipping": "2-5 business days",
          "Quality": "International standards",
          "Support": "24/7"
        };
    }
  };

  const specifications = getSpecifications(category);

  return (
    <div className="w-full">
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <h4 className="text-lg font-bold mb-6 text-electric-yellow">المواصفات التقنية</h4>
        <div className="space-y-4">
          {Object.entries(specifications).map(([key, value], index) => (
            <div key={index} className="text-gray-300">
              <span className="font-semibold text-white">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}