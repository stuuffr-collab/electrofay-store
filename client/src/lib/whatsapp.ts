export interface OrderData {
  product: {
    id: string;
    name: string;
    price: number;
  };
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
}

export function createWhatsAppMessage(orderData: OrderData): string {
  const { product, customer } = orderData;
  
  const message = `🛒 *طلب جديد من إلكتروفاي*

📦 *المنتج:* ${product.name}
💰 *السعر:* ${product.price} دينار ليبي
🆔 *كود المنتج:* ${product.id}

👤 *بيانات العميل:*
• الاسم: ${customer.name}
• رقم الهاتف: ${customer.phone}
• المدينة: ${customer.city}
• العنوان: ${customer.address}

${customer.notes ? `📝 *ملاحظات:* ${customer.notes}` : ''}

⏰ *تاريخ الطلب:* ${new Date().toLocaleString('ar-LY')}`;

  return message;
}

export function openWhatsApp(message: string, phoneNumber: string = "218922569912"): void {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

export function shareProduct(platform: 'whatsapp' | 'facebook' | 'twitter', productName: string, productPrice: number): void {
  const productUrl = window.location.href;
  let shareUrl = '';

  switch (platform) {
    case 'whatsapp':
      const whatsappMessage = `🛒 شاهد هذا المنتج الرائع من إلكتروفاي!\n\n${productName}\nالسعر: ${productPrice} د.ل\n\n${productUrl}`;
      shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
      break;
    case 'twitter':
      const twitterMessage = `🛒 ${productName} - ${productPrice} د.ل من إلكتروفاي`;
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}&url=${encodeURIComponent(productUrl)}`;
      break;
  }

  window.open(shareUrl, '_blank', 'width=600,height=400');
}
