-- ========================================
-- Supabase Storage Policies for product-images bucket
-- ========================================
-- 
-- 사용 방법:
-- 1. Supabase 대시보드에서 Storage → product-images 버킷 생성 (Public bucket 체크)
-- 2. SQL Editor에서 아래 SQL 실행
--
-- ========================================

-- 정책 1: 공개 읽기 (누구나 이미지 볼 수 있음)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- 정책 2: 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 정책 3: 소유자만 자신의 이미지 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 정책 4 (선택사항): 소유자만 자신의 이미지 업데이트 가능
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ========================================
-- 정책 확인 쿼리
-- ========================================
-- 생성된 정책들을 확인하려면 아래 쿼리 실행:
-- 
-- SELECT * FROM pg_policies 
-- WHERE tablename = 'objects' 
-- AND schemaname = 'storage';
-- ========================================

