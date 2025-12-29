# 🚀 빠른 시작 가이드

## ⚠️ 현재 상황
`supabaseUrl is required` 오류가 발생했습니다.
→ 환경 변수가 설정되지 않았기 때문입니다.

---

## 🔧 해결 방법 (2가지 옵션)

### 옵션 1: 일단 둘러보기만 (추천) ⚡

**인증 기능 없이 먼저 UI만 보고 싶다면:**

1. 현재 상태 그대로 사용하세요
2. 로그인/회원가입 기능은 작동하지 않지만 나머지 UI는 정상 작동합니다
3. 콘솔에 경고 메시지가 나와도 무시하세요

**제한 사항:**
- ❌ 로그인/회원가입 불가
- ❌ 마이페이지 접근 불가
- ❌ 상품 등록 불가
- ✅ 메인 페이지 조회 가능
- ✅ 카테고리 필터링 가능
- ✅ UI 둘러보기 가능

---

### 옵션 2: 완전한 기능 사용하기 (5분 소요) 🔐

**모든 기능을 사용하려면 Supabase 설정이 필요합니다:**

#### Step 1: Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - Name: `my-market`
   - Database Password: 자동 생성된 비밀번호 사용
   - Region: **Northeast Asia (Seoul)** 선택
6. "Create new project" 클릭 (약 2분 대기)

#### Step 2: API 키 가져오기

1. 왼쪽 메뉴 **Settings** (⚙️) 클릭
2. **API** 메뉴 클릭
3. 다음 값 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)

#### Step 3: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고:

```bash
# .env.local 파일 내용
NEXT_PUBLIC_SUPABASE_URL=복사한_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한_anon_key
```

**Windows에서 파일 만들기:**
```powershell
# PowerShell에서
notepad .env.local
```

**또는 템플릿 사용:**
```powershell
# env.local.template 파일을 .env.local로 복사
copy env.local.template .env.local
# 그 다음 .env.local 파일을 열어서 실제 값으로 교체
```

#### Step 4: 데이터베이스 테이블 생성

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. `supabase_schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭

#### Step 5: 개발 서버 재시작

```bash
# 현재 서버 중지 (터미널에서 Ctrl + C)
# 다시 시작
npm run dev
```

#### Step 6: 테스트

1. `http://localhost:3000` 접속
2. 우측 상단 **"로그인"** 버튼 클릭
3. **회원가입** 탭에서 계정 생성
4. 모든 기능 사용 가능! 🎉

---

## 📋 체크리스트

### 옵션 1 (UI만 보기)
- [x] npm run dev 실행
- [x] 브라우저에서 localhost:3000 접속
- [x] 콘솔 경고 무시

### 옵션 2 (완전한 기능)
- [ ] Supabase 프로젝트 생성
- [ ] API 키 복사
- [ ] .env.local 파일 생성
- [ ] 환경 변수 입력
- [ ] SQL 스키마 실행
- [ ] 개발 서버 재시작
- [ ] 회원가입/로그인 테스트

---

## 🆘 문제 해결

### "supabaseUrl is required" 오류
→ ✅ 이미 해결됨! 이제 경고만 표시되고 앱은 작동합니다.

### 로그인이 안 돼요
→ .env.local 파일이 올바르게 설정되었는지 확인하세요
→ 개발 서버를 재시작했는지 확인하세요

### SQL 실행 오류
→ `supabase_schema.sql` 파일 내용 전체를 복사했는지 확인하세요
→ Supabase SQL Editor에서 실행하세요

### 여전히 안 돼요
→ 터미널을 종료하고 완전히 새로 시작하세요
→ 브라우저 캐시를 삭제하고 다시 시도하세요

---

## 💡 추천 순서

**처음 보는 분:**
1. 옵션 1로 먼저 UI 둘러보기 (1분)
2. 마음에 들면 옵션 2로 완전한 기능 설정 (5분)

**바로 사용하고 싶은 분:**
1. 옵션 2로 바로 Supabase 설정
2. 5분이면 모든 기능 사용 가능!

---

## 📖 더 자세한 정보

- **SUPABASE_SETUP.md** - Supabase 상세 설정 가이드
- **FEATURES.md** - 구현된 모든 기능 목록
- **supabase_schema.sql** - 데이터베이스 스키마

---

**🎯 어떤 방법을 선택하시겠어요?**

1. **일단 UI만 보기** → 그냥 `npm run dev` 실행하고 접속
2. **완전한 기능 사용** → 위의 Step 1~6 따라하기 (5분)

