import { Camera, Mail, User, Calendar, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase/client';

interface ProfilePageProps {
  user?: any;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('일상을 기록하는 걸 좋아합니다 ✨');
  const [joinDate, setJoinDate] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자');
      setEmail(user.email || '');

      const created = new Date(user.created_at);
      const formattedDate = `${created.getFullYear()}년 ${created.getMonth() + 1}월 ${created.getDate()}일`;
      setJoinDate(formattedDate);
    }
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      alert('로그아웃에 실패했습니다.');
    } else {
      alert('로그아웃되었습니다.');
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">프로필</h2>
          <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-16 pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    {name?.[0]?.toUpperCase() || '나'}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">프로필 사진 변경</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-purple-500" />
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-purple-500" />
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-purple-500" />
                소개
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                가입일
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
                {joinDate || '정보 없음'}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
            변경사항 저장
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-xs text-gray-500 mt-1">참여 서버</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-pink-600">48</p>
            <p className="text-xs text-gray-500 mt-1">업로드한 추억</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-xs text-gray-500 mt-1">AI 하이라이트</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-6 space-y-2 pb-24">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">알림 설정</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">개인정보 설정</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">고객 지원</span>
            <span className="text-gray-400">›</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-xl shadow-sm hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
}
