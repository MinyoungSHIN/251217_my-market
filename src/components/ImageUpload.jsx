'use client';

import { useState } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ImageUpload({ value, onChange, userId }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);

    try {
      // 파일명 생성 (사용자ID/타임스탬프_파일명)
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Public URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-base-300">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="block">
          <div className="w-full aspect-square max-w-md mx-auto border-2 border-dashed border-base-300 rounded-lg hover:border-primary transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="mt-4 text-sm text-base-content/60">업로드 중...</p>
                </>
              ) : (
                <>
                  <ImageIcon size={48} className="text-base-content/40 mb-4" />
                  <p className="text-base font-semibold text-base-content/80 mb-2">
                    클릭하여 이미지 업로드
                  </p>
                  <p className="text-sm text-base-content/60">
                    JPG, PNG, GIF (최대 5MB)
                  </p>
                  <div className="mt-4">
                    <span className="btn btn-primary btn-sm gap-2">
                      <Upload size={16} />
                      파일 선택
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

