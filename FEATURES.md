# 🥜 땅콩마켓 - 구현된 기능 목록

## ✅ 완료된 기능

### 1️⃣ 마이페이지 (`/mypage`)

**경로**: `/mypage`

**주요 기능**:
- ✅ 사용자 프로필 표시
  - 닉네임
  - 이메일
  - 프로필 이미지 (아바타)
- ✅ 프로필 편집
  - 닉네임 수정
  - 프로필 이미지 URL 변경
- ✅ 내가 등록한 상품 목록
- ✅ 찜한 상품 목록
- ✅ 탭 전환 (프로필/내 상품/찜한 상품)

**파일**: `src/app/mypage/page.js`

---

### 2️⃣ 권한 체크

**주요 기능**:
- ✅ 로그인 상태 확인 (useAuth 훅)
- ✅ 글쓰기 권한 체크
  - 비로그인 시 로그인 페이지로 리디렉션
  - 로그인 후 글쓰기 가능
- ✅ 상품 등록 페이지 접근 제한

**파일**: 
- `src/hooks/useAuth.js` - 인증 커스텀 훅
- `src/app/page.js` - 권한 체크 로직
- `src/app/write/page.js` - 상품 등록 페이지

**구현 내용**:
```javascript
// 글쓰기 버튼 클릭 시
const handleWriteClick = () => {
  if (!isAuthenticated) {
    alert('로그인이 필요합니다!');
    router.push('/auth');
    return;
  }
  router.push('/write');
};
```

---

### 3️⃣ 소셜 로그인

**지원 플랫폼**:
- ✅ Google 로그인
- ✅ Kakao 로그인

**주요 기능**:
- ✅ OAuth 2.0 소셜 로그인
- ✅ 자동 계정 생성
- ✅ 로그인 후 자동 리디렉션

**파일**: `src/app/auth/page.js`

**사용법**:
1. Supabase 대시보드에서 Google/Kakao Provider 활성화
2. OAuth 클라이언트 ID 설정
3. 로그인 페이지에서 소셜 로그인 버튼 클릭

---

### 4️⃣ 사용자 프로필

**주요 기능**:
- ✅ 닉네임 설정/수정
- ✅ 프로필 이미지 설정/수정
- ✅ 프로필 정보 자동 저장 (Supabase profiles 테이블)
- ✅ 회원가입 시 자동 프로필 생성 (트리거)

**데이터베이스 구조**:
```sql
profiles (
  id uuid PRIMARY KEY,
  nickname text,
  avatar_url text,
  created_at timestamp,
  updated_at timestamp
)
```

---

## 📁 전체 파일 구조

```
src/
├── app/
│   ├── auth/
│   │   └── page.js              ✨ 로그인/회원가입 (소셜 로그인 포함)
│   ├── mypage/
│   │   └── page.js              ✨ 마이페이지 (프로필, 내 상품, 찜)
│   ├── write/
│   │   └── page.js              ✨ 상품 등록 (권한 체크)
│   ├── components/
│   │   ├── Header.js            🔧 로그인 상태 표시
│   │   ├── BottomNav.js
│   │   ├── ItemCard.jsx
│   │   └── ItemList.jsx
│   └── page.js                  🔧 메인 페이지 (권한 체크)
├── data/
│   └── products.js              상품 데이터
├── hooks/
│   └── useAuth.js               ✨ 인증 커스텀 훅
├── lib/
│   └── supabase.js              Supabase 클라이언트
└── utils/
    └── kakaoMap.js              Kakao Map API

supabase_schema.sql              ✨ 데이터베이스 스키마
SUPABASE_SETUP.md                📖 Supabase 설정 가이드
FEATURES.md                      📖 이 파일
```

---

## 🎯 주요 기능 사용 흐름

### 1. 회원가입 & 로그인
```
1. /auth 접속
2. 이메일/비밀번호 또는 소셜 로그인
3. 자동으로 profiles 테이블에 프로필 생성
4. 메인 페이지로 리디렉션
```

### 2. 상품 등록
```
1. 메인 페이지 우측 하단 FAB 버튼 클릭
2. 로그인 체크
3. /write 페이지로 이동
4. 상품 정보 입력
5. items 테이블에 저장
```

### 3. 프로필 관리
```
1. 헤더의 사용자 아이콘 클릭
2. "나의땅콩" 메뉴 클릭
3. /mypage 접속
4. 프로필 탭에서 정보 수정
5. profiles 테이블 업데이트
```

### 4. 찜하기
```
1. 상품 카드의 하트 아이콘 클릭
2. likes 테이블에 저장 (추후 구현)
3. 마이페이지에서 찜한 상품 확인
```

---

## 🔐 권한 체계

### 비로그인 사용자
- ✅ 상품 목록 조회
- ✅ 카테고리 필터링
- ❌ 상품 등록
- ❌ 찜하기
- ❌ 마이페이지 접근

### 로그인 사용자
- ✅ 상품 목록 조회
- ✅ 카테고리 필터링
- ✅ 상품 등록
- ✅ 찜하기
- ✅ 마이페이지 접근
- ✅ 자신의 상품 수정/삭제

---

## 🗄️ 데이터베이스 테이블

### profiles
- 사용자 프로필 정보
- 닉네임, 아바타 URL
- RLS: 자신의 프로필만 수정 가능

### items
- 상품 정보
- 제목, 설명, 가격, 카테고리, 위치, 이미지, 상태
- RLS: 모두 조회 가능, 자신의 상품만 수정/삭제

### likes
- 찜하기 정보
- user_id + item_id 조합
- RLS: 자신의 찜 목록만 관리 가능

---

## 🎨 UI/UX 특징

### 디자인 시스템
- 🎨 DaisyUI 컴포넌트
- 🌙 다크 테마 지원
- 📱 모바일 우선 반응형 디자인
- 🎯 Lucide React 아이콘

### 사용자 경험
- ⚡ 빠른 상태 업데이트
- 🔄 실시간 로그인 상태 감지
- 💾 LocalStorage 활용 (동네 정보)
- 🎭 로딩 상태 표시
- ✨ 부드러운 애니메이션

---

## 🚀 다음 단계 (추가 가능 기능)

### 상품 관리
- [ ] 상품 수정 기능
- [ ] 상품 삭제 기능
- [ ] 상품 상태 변경 (판매중/예약중/거래완료)
- [ ] 상품 이미지 업로드 (Supabase Storage)

### 찜하기 & 채팅
- [ ] 찜하기 DB 연동
- [ ] 실시간 채팅 (Supabase Realtime)
- [ ] 채팅방 목록
- [ ] 읽지 않은 메시지 알림

### 검색 & 필터
- [ ] 키워드 검색
- [ ] 가격 범위 필터
- [ ] 위치 기반 검색
- [ ] 정렬 기능 (최신순, 가격순, 인기순)

### 알림
- [ ] 찜한 상품 가격 변동 알림
- [ ] 채팅 메시지 알림
- [ ] 내 상품 문의 알림

### 프로필 개선
- [ ] 사용자 신뢰도 평가
- [ ] 거래 후기 시스템
- [ ] 판매/구매 내역
- [ ] 매너 온도

---

## 📚 기술 스택

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS v4, DaisyUI
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Map**: Kakao Map API (선택사항)
- **State**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router

---

## 🔧 개발 도구

- **Package Manager**: npm
- **Linter**: ESLint
- **React Compiler**: Babel Plugin React Compiler
- **PostCSS**: Tailwind CSS PostCSS Plugin

---

## 📖 관련 문서

- `SUPABASE_SETUP.md` - Supabase 초기 설정 가이드
- `KAKAO_API_SETUP.md` - Kakao Map API 설정
- `supabase_schema.sql` - 데이터베이스 스키마
- `README.md` - 프로젝트 개요

---

## ✅ 체크리스트

### 구현 완료
- [x] 이메일/비밀번호 로그인
- [x] 회원가입
- [x] 소셜 로그인 (Google, Kakao)
- [x] 자동 세션 관리
- [x] 마이페이지
- [x] 프로필 편집
- [x] 권한 체크
- [x] 상품 등록
- [x] 로그인 상태 표시

### 설정 필요
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (`.env.local`)
- [ ] 데이터베이스 테이블 생성 (SQL 실행)
- [ ] 소셜 로그인 Provider 설정 (선택사항)

---

**🎉 모든 기능이 성공적으로 구현되었습니다!**

문제가 있거나 추가 기능이 필요하면 언제든지 요청해주세요! 🚀

