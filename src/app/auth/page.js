'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const router = useRouter();

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider) => {
    try {
      const { data, error} = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Social login error:', error);
      setError(error.message || '소셜 로그인에 실패했습니다.');
    }
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 로그인 성공
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 처리
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      setMessage('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
      setEmail('');
      setPassword('');
      
      if (data.session) {
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🥜 땅콩마켓
          </h1>
          <p className="text-base-content/60">
            {mode === 'login' ? '로그인하여 시작하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* 인증 폼 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* 모드 전환 탭 */}
            <div className="tabs tabs-boxed mb-6">
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setMessage(null);
                }}
                className={`tab tab-lg flex-1 gap-2 ${
                  mode === 'login' ? 'tab-active' : ''
                }`}
              >
                <LogIn size={18} />
                로그인
              </button>
              <button
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setMessage(null);
                }}
                className={`tab tab-lg flex-1 gap-2 ${
                  mode === 'signup' ? 'tab-active' : ''
                }`}
              >
                <UserPlus size={18} />
                회원가입
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 성공 메시지 */}
            {message && (
              <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {/* 로그인 폼 */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail size={16} />
                      이메일
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Lock size={16} />
                      비밀번호
                    </span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      로그인
                    </>
                  )}
                </button>

                {/* 소셜 로그인 */}
                <div className="divider">또는</div>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="btn btn-outline w-full gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google로 계속하기
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('kakao')}
                    className="btn w-full gap-2"
                    style={{ backgroundColor: '#FEE500', color: '#000000', border: 'none' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 3C6.486 3 2 6.262 2 10.29c0 2.546 1.691 4.78 4.244 6.043l-1.002 3.669a.4.4 0 0 0 .585.459l4.313-2.87c.539.072 1.087.109 1.64.109 5.514 0 10-3.262 10-7.29C22 6.262 17.514 3 11.78 3z"/>
                    </svg>
                    Kakao로 계속하기
                  </button>
                </div>
              </form>
            )}

            {/* 회원가입 폼 */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail size={16} />
                      이메일
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Lock size={16} />
                      비밀번호 (최소 6자)
                    </span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      가입 중...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      회원가입
                    </>
                  )}
                </button>

                <p className="text-xs text-base-content/60 text-center mt-4">
                  회원가입 시 이메일 확인이 필요할 수 있습니다.
                </p>

                {/* 소셜 로그인 */}
                <div className="divider">또는</div>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="btn btn-outline w-full gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google로 계속하기
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('kakao')}
                    className="btn w-full gap-2"
                    style={{ backgroundColor: '#FEE500', color: '#000000', border: 'none' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 3C6.486 3 2 6.262 2 10.29c0 2.546 1.691 4.78 4.244 6.043l-1.002 3.669a.4.4 0 0 0 .585.459l4.313-2.87c.539.072 1.087.109 1.64.109 5.514 0 10-3.262 10-7.29C22 6.262 17.514 3 11.78 3z"/>
                    </svg>
                    Kakao로 계속하기
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

