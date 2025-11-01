import { supabase } from './supabaseClient';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageToSupabase(file: File): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('✅ Image uploaded successfully:', publicUrl);
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteImageFromSupabase(imageUrl: string): Promise<boolean> {
  try {
    const filePath = imageUrl.split('/products/').pop();
    if (!filePath) {
      console.error('Invalid image URL');
      return false;
    }

    const { error } = await supabase.storage
      .from('products')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    console.log('✅ Image deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteImageFromSupabase:', error);
    return false;
  }
}
