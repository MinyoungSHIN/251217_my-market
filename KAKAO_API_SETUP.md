# Kakao Map API 설정 가이드

## 1. Kakao Developers에서 API 키 발급

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 후 '내 애플리케이션' 메뉴로 이동
3. '애플리케이션 추가하기' 클릭
4. 앱 이름 입력 후 생성
5. 생성된 앱의 '앱 키' 탭에서 **JavaScript 키** 복사

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```bash
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_javascript_key_here
```

> **주의**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 3. 플랫폼 등록

Kakao Developers 콘솔에서:

1. 애플리케이션 선택
2. '플랫폼' 메뉴 클릭
3. 'Web 플랫폼 등록' 클릭
4. 사이트 도메인 입력:
   - 개발: `http://localhost:3000`
   - 배포: 실제 도메인 (예: `https://yourdomain.com`)

## 4. 개발 서버 재시작

환경 변수 추가 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 5. 테스트

헤더의 동 선택 드롭다운에서 "현재 위치로 설정" 버튼을 클릭하여 테스트하세요.

- 브라우저에서 위치 권한 요청이 나타납니다
- 허용하면 현재 위치의 동 이름이 표시됩니다

## 데모 모드

API 키가 설정되지 않은 경우 자동으로 데모 모드로 작동하여 "역삼동"을 기본값으로 사용합니다.

## 문제 해결

### 위치 정보를 가져올 수 없는 경우

1. **HTTPS 필요**: 프로덕션에서는 HTTPS가 필수입니다
2. **브라우저 권한**: 브라우저 설정에서 위치 권한이 허용되어 있는지 확인
3. **API 키 확인**: 환경 변수가 올바르게 설정되었는지 확인
4. **플랫폼 등록**: Kakao Developers에서 도메인이 등록되었는지 확인

### 크롬에서 테스트 시

`chrome://settings/content/location`에서 위치 권한 설정을 확인하세요.

