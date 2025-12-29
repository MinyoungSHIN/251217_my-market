# 🖼️ Supabase Storage 설정 가이드

## 개요
상품 이미지를 업로드하고 관리하기 위한 Supabase Storage 설정 방법입니다.

---

## 1. Storage 버킷 생성

### Step 1: Supabase 대시보드 접속
1. [Supabase 대시보드](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭

### Step 2: 새 버킷 만들기
1. **New Bucket** 버튼 클릭
2. 버킷 설정:
   ```
   Name: product-images
   Public bucket: ✅ 체크 (공개 읽기 허용)
   ```
3. **Create bucket** 클릭

---

## 2. Storage 정책(Policy) 설정

버킷 생성 후 **Policies** 탭에서 다음 정책들을 추가하세요.

### 정책 1: 공개 읽기 (Public Read)
누구나 이미지를 볼 수 있도록 허용합니다.

1. **New Policy** 클릭
2. **Get started quickly** → **For full customization** 선택
3. 다음 SQL 입력:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

또는 **UI에서 설정**:
- **Policy name**: `Public Access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**:
  ```sql
  bucket_id = 'product-images'
  ```

---

### 정책 2: 인증된 사용자 업로드 (Authenticated Upload)
로그인한 사용자만 이미지를 업로드할 수 있습니다.

1. **New Policy** 클릭
2. 다음 SQL 입력:

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

또는 **UI에서 설정**:
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
  ```sql
  bucket_id = 'product-images'
  ```

---

### 정책 3: 소유자만 삭제 (Owner Delete)
자신이 업로드한 이미지만 삭제할 수 있습니다.

1. **New Policy** 클릭
2. 다음 SQL 입력:

```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

또는 **UI에서 설정**:
- **Policy name**: `Users can delete own images`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  ```

---

## 3. 정책 확인

설정이 완료되면 **Policies** 탭에서 다음 3개의 정책이 표시되어야 합니다:

| Policy Name | Operation | Target Roles |
|-------------|-----------|--------------|
| Public Access | SELECT | public |
| Authenticated users can upload | INSERT | authenticated |
| Users can delete own images | DELETE | authenticated |

---

## 4. 폴더 구조

이미지는 다음과 같은 구조로 저장됩니다:

```
product-images/
  ├── {user_id_1}/
  │   ├── 1234567890_abc123.jpg
  │   ├── 1234567891_def456.png
  │   └── ...
  ├── {user_id_2}/
  │   ├── 1234567892_ghi789.jpg
  │   └── ...
  └── ...
```

각 사용자의 이미지는 `{user_id}` 폴더에 저장됩니다.

---

## 5. 테스트

### 5-1. 브라우저에서 테스트
1. 애플리케이션에서 **로그인**
2. **상품 등록** 버튼(+) 클릭
3. **이미지 업로드** 영역 클릭
4. 이미지 파일 선택 (JPG, PNG, GIF - 최대 5MB)
5. 업로드 완료 후 미리보기 확인

### 5-2. Supabase 대시보드에서 확인
1. **Storage** → **product-images** 버킷 클릭
2. 사용자 ID 폴더 확인
3. 업로드된 이미지 파일 확인

---

## 6. 파일 크기 및 타입 제한

현재 설정된 제한사항:

- **최대 파일 크기**: 5MB
- **허용 파일 타입**: 이미지 파일 (image/*)
  - JPG, JPEG
  - PNG
  - GIF
  - WebP
  - 기타 이미지 형식

제한을 변경하려면 `src/components/ImageUpload.jsx` 파일을 수정하세요.

---

## 7. 문제 해결

### "Failed to upload" 에러
**원인**: Storage 정책이 제대로 설정되지 않았습니다.

**해결**:
1. Supabase 대시보드 → Storage → product-images → Policies
2. 위의 3개 정책이 모두 활성화되어 있는지 확인
3. 정책이 없다면 위의 SQL을 실행하여 추가

### "Policy violation" 에러
**원인**: 인증되지 않은 상태에서 업로드를 시도했습니다.

**해결**:
1. 로그인 상태 확인
2. 브라우저 콘솔(F12)에서 `localStorage` 확인
3. 필요시 로그아웃 후 다시 로그인

### 이미지가 표시되지 않음
**원인**: Public bucket이 활성화되지 않았습니다.

**해결**:
1. Storage → product-images → Configuration
2. **Public bucket** 옵션이 체크되어 있는지 확인
3. 체크되어 있지 않다면 활성화

### 파일명이 한글로 깨짐
**현재 구현**: 파일명은 타임스탬프와 랜덤 문자열로 자동 생성됩니다.
- 형식: `{timestamp}_{random}.{ext}`
- 예: `1704067200_abc123.jpg`

원본 파일명을 유지하려면 `ImageUpload.jsx`를 수정하세요.

---

## 8. 고급 설정

### 파일 크기 제한 변경

`src/components/ImageUpload.jsx` 파일에서:

```javascript
// 현재: 5MB
if (file.size > 5 * 1024 * 1024) {
  alert('파일 크기는 5MB 이하여야 합니다.');
  return;
}

// 변경 예시: 10MB
if (file.size > 10 * 1024 * 1024) {
  alert('파일 크기는 10MB 이하여야 합니다.');
  return;
}
```

### 이미지 최적화 추가

업로드 전 이미지를 자동으로 리사이즈하려면:

```bash
npm install browser-image-compression
```

```javascript
import imageCompression from 'browser-image-compression';

// ImageUpload.jsx의 handleFileChange 함수에서
const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};
const compressedFile = await imageCompression(file, options);
```

---

## 9. Storage 사용량 확인

1. Supabase 대시보드 → **Settings** → **Usage**
2. **Storage** 섹션에서 사용량 확인
3. 무료 플랜: 1GB 제공

---

## 📚 추가 리소스

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Storage 정책 가이드](https://supabase.com/docs/guides/storage/security/access-control)
- [Next.js Image 최적화](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## ✅ 완료 체크리스트

- [ ] `product-images` 버킷 생성
- [ ] Public bucket 활성화
- [ ] Public Access 정책 추가
- [ ] Authenticated Upload 정책 추가
- [ ] Owner Delete 정책 추가
- [ ] 브라우저에서 이미지 업로드 테스트
- [ ] Supabase 대시보드에서 파일 확인
- [ ] 상품 등록 후 이미지 정상 표시 확인

설정이 완료되면 이미지 업로드 기능을 사용할 수 있습니다! 🎉

