import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface ImageUploadResult {
  url: string;
  path: string;
  success: boolean;
  error?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File, folder: string = 'products'): Promise<ImageUploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('الملف المحدد ليس صورة صالحة');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('خطأ في رفع الصورة:', error);
        throw new Error(error.message || 'فشل في رفع الصورة');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setUploadProgress(100);

      return {
        url: publicUrl,
        path: fileName,
        success: true
      };

    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      return {
        url: '',
        path: '',
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
      };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) {
        console.error('خطأ في حذف الصورة:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('خطأ في حذف الصورة:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress
  };
}