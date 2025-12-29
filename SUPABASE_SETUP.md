# 🥜 땅콩마켓 - Supabase 인증 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - Name: `my-market` (또는 원하는 이름)
   - Database Password: 강력한 비밀번호 생성
   - Region: `Northeast Asia (Seoul)` 선택
6. "Create new project" 클릭 (약 2분 소요)

## 2. API 키 가져오기

프로젝트가 생성되면:

1. 왼쪽 메뉴에서 **Settings** (⚙️) 클릭
2. **API** 메뉴 클릭
3. **Project API keys** 섹션에서 다음 값 복사:
   - `Project URL`
   - `anon public` 키

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Kakao Map API (선택사항)
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_api_key_here
```

**⚠️ 중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 4. 이메일 인증 설정 (선택사항)

기본적으로 Supabase는 이메일 확인을 요구합니다. 개발 중에는 이를 비활성화할 수 있습니다:

1. Supabase 대시보드에서 **Authentication** → **Providers** 클릭
2. **Email** 제공자 설정
3. **Confirm email** 토글을 OFF로 설정
4. **Save** 클릭

## 5. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
# 현재 서버 중지 (Ctrl + C)
# 다시 시작
npm run dev
```

## 6. 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 우측 상단의 **로그인** 버튼 클릭
3. **회원가입** 탭 클릭
4. 이메일과 비밀번호 입력 (비밀번호 최소 6자)
5. 회원가입 완료!

## 7. 사용 가능한 기능

### ✅ 구현된 기능
- 📧 이메일/비밀번호 로그인
- 📝 회원가입
- 🔐 자동 세션 관리
- 👤 사용자 정보 표시
- 🚪 로그아웃
- 🔄 자동 로그인 유지

### 📍 인증 페이지
- **로그인/회원가입**: `/auth`
- **마이페이지**: `/mypage` (추후 구현 가능)

### 🎨 UI 특징
- DaisyUI 컴포넌트 사용
- 다크 테마 지원
- 반응형 디자인
- Lucide React 아이콘

## 8. 문제 해결

### "Invalid API key" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- API 키가 정확히 복사되었는지 확인
- 개발 서버를 재시작했는지 확인

### 이메일이 오지 않음
- Supabase 대시보드에서 이메일 확인 설정 확인
- 스팸 폴더 확인
- 개발 중에는 이메일 확인 비활성화 권장

### 로그인 후 리디렉션 안됨
- `next/navigation`의 `useRouter` 사용 확인
- 브라우저 콘솔에서 에러 확인

## 9. 소셜 로그인 설정 (선택사항)

### Google 로그인 설정

1. Supabase 대시보드에서 **Authentication** → **Providers** 클릭
2. **Google** 제공자 찾기
3. **Enable Sign in with Google** 토글 ON
4. [Google Cloud Console](https://console.cloud.google.com/) 접속
5. OAuth 2.0 클라이언트 ID 생성:
   - Authorized redirect URIs: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. Client ID와 Client Secret을 Supabase에 입력
7. **Save** 클릭

### Kakao 로그인 설정

1. Supabase 대시보드에서 **Authentication** → **Providers** 클릭
2. **Kakao** 제공자 찾기
3. **Enable Sign in with Kakao** 토글 ON
4. [Kakao Developers](https://developers.kakao.com/) 접속
5. 애플리케이션 생성 및 설정:
   - Redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. REST API 키와 Client Secret을 Supabase에 입력
7. **Save** 클릭

## 10. 데이터베이스 테이블 생성

프로젝트 루트의 `supabase_schema.sql` 파일을 Supabase SQL Editor에서 실행하세요:

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. `supabase_schema.sql` 파일 내용 복사 & 붙여넣기
4. **Run** 클릭

생성되는 테이블:
- `profiles` - 사용자 프로필 (닉네임, 아바타)
- `items` - 상품 정보
- `likes` - 찜하기 정보

## 11. 프로덕션 배포 시

Vercel, Netlify 등에 배포할 때:

1. 플랫폼의 환경 변수 설정에 다음 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Supabase 대시보드에서 **Authentication** → **URL Configuration**:
   - **Site URL**: 실제 배포 URL 입력
   - **Redirect URLs**: 배포 URL 추가

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [DaisyUI 문서](https://daisyui.com/)

---

문제가 발생하면 Supabase 대시보드의 로그를 확인하세요! 🔍

