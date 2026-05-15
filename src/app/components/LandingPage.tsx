import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import logoIcon from '../../imports/_______.png';

export function LandingPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        alert(`로그인 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !email || !password || !confirmPassword) {
      alert('닉네임, 이메일, 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (nickname.trim().length < 2) {
      alert('닉네임은 2자 이상 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nickname.trim(),
            nickname: nickname.trim(),
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        setIsSignUp(false);
        setNickname('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 sm:p-8 bg-transparent overflow-y-auto">
      <div className="mx-auto max-w-6xl min-h-full lg:min-h-0 lg:h-full grid lg:grid-cols-[1.05fr_0.95fr] rounded-[2rem] border border-[#d8cbb8] bg-[#fffdf9]/90 backdrop-blur-sm shadow-[0_30px_90px_-45px_rgba(30,37,42,0.7)] overflow-hidden grain-overlay">
        <section className="relative p-8 sm:p-10 lg:p-14 bg-gradient-to-br from-[#f8f2e8] via-[#f5ede1] to-[#efe2d2] text-[#1f2529] hero-reveal">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#cdbca7] bg-white/70 px-4 py-2 text-xs tracking-[0.18em] text-[#50616b]">
              <img src={logoIcon} alt="DAYSERVER" className="size-5 rounded-md" />
              DAYSERVER ARCHIVE
            </div>
            <h1 className="font-display mt-7 text-5xl leading-[0.94] text-[#20282e] sm:text-6xl">
              Share
              <br />
              Your Day,
              <br />
              Keep It Warm
            </h1>
            <p className="mt-7 max-w-md text-sm sm:text-base leading-relaxed text-[#3f5058]">
              메신저처럼 흘러가는 기록이 아니라, 꺼내보고 싶은 하루의 장면으로 남겨두세요.
              DAYSERVER는 친구들과의 순간을 감성적인 타임캡슐로 정리해 줍니다.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                '서버별로 사진과 대화를 한곳에',
                'AI로 추억 하이라이트 자동 정리',
                '캘린더로 날짜별 다시 보기',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#314047]">
                  <CheckCircle2 className="size-4 text-[#8c4d3f]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-[#a36553]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#415564]/18 blur-3xl" />
        </section>

        <section className="p-8 sm:p-10 lg:p-12 bg-[#fffdf9] hero-reveal">
          <div className="max-w-md mx-auto">
            <h2 className="text-sm tracking-[0.24em] text-[#6d7a82]">WELCOME BACK</h2>
            <p className="mt-2 text-2xl font-semibold text-[#1f2529]">{isSignUp ? '새 계정 만들기' : '로그인'}</p>

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="mt-8 space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-[#33444d] mb-2">
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    className="w-full px-4 py-3 border border-[#d7cab8] bg-[#fdfaf4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c4d3f]/30"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#33444d] mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-[#d7cab8] bg-[#fdfaf4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c4d3f]/30"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#33444d] mb-2">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="최소 6자 이상"
                  className="w-full px-4 py-3 border border-[#d7cab8] bg-[#fdfaf4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c4d3f]/30"
                  disabled={loading}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#33444d] mb-2">
                    비밀번호 확인
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full px-4 py-3 border border-[#d7cab8] bg-[#fdfaf4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c4d3f]/30"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 bg-[#222c32] hover:bg-[#1a2228] text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span>처리 중...</span> : <span>{isSignUp ? '회원가입' : '로그인'}</span>}
                {!loading && <ArrowRight className="size-4" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setNickname('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-[#8c4d3f] hover:text-[#774234] font-medium"
                disabled={loading}
              >
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
              </button>
            </div>

            <p className="mt-7 text-center text-xs text-[#74818a] leading-relaxed">
              계속 진행하면 DAYSERVER의 서비스 약관 및
              <br />
              개인정보 보호정책에 동의하게 됩니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
