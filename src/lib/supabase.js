import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 공개 키
// .env.local 파일에 추가하세요
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 환경 변수 확인
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다!');
  console.warn('📝 .env.local 파일을 생성하고 다음 내용을 추가하세요:');
  console.warn('   NEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  console.warn('📖 자세한 설정 방법: SUPABASE_SETUP.md 파일을 참조하세요');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

