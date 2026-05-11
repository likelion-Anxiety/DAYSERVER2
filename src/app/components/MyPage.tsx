import { useState } from 'react';
import { Settings, Image as ImageIcon, Save, Plus, X, Move } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';

interface Widget {
  id: string;
  type: 'profile' | 'recent-posts' | 'gallery' | 'calendar' | 'friends' | 'bio';
  position: number;
}

interface MyPageProps {
  userId: string;
  isOwner: boolean;
}

const defaultWidgets: Widget[] = [
  { id: '1', type: 'profile', position: 0 },
  { id: '2', type: 'bio', position: 1 },
  { id: '3', type: 'recent-posts', position: 2 },
  { id: '4', type: 'gallery', position: 3 },
];

export function MyPage({ userId, isOwner }: MyPageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200');
  const [profileImage, setProfileImage] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || 'user'}`);
  const [bannerColor, setBannerColor] = useState('#8B5CF6');
  const [bio, setBio] = useState('여행과 사진을 좋아하는 개발자입니다.');
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [showBannerCustomize, setShowBannerCustomize] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      alert('로그아웃에 실패했습니다.');
      return;
    }
    alert('로그아웃되었습니다.');
  };

  const recentPosts = [
    { id: '1', title: '제주도 여행', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', date: '2026-05-06' },
    { id: '2', title: 'MT 추억', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', date: '2026-04-25' },
    { id: '3', title: '새벽 산책', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400', date: '2026-05-03' },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400',
    'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400',
  ];

  const friends = [
    { id: '1', name: '이유진', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: '2', name: '최수민', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    { id: '3', name: '박서준', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  ];

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <div className="flex items-center gap-4">
              <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{userId || 'user'}</h3>
                <p className="text-gray-600 text-sm">@{userId || 'user'}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span><strong>142</strong> 친구</span>
                  <span><strong>28</strong> 게시물</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bio':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">소개</h3>
            {isEditMode && isOwner ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-700">{bio}</p>
            )}
          </div>
        );

      case 'recent-posts':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">최근 게시물</h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                  <img src={post.image} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">사진 갤러리</h3>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full aspect-square rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
            </div>
          </div>
        );

      case 'friends':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">친구 ({friends.length})</h3>
            <div className="grid grid-cols-3 gap-3">
              {friends.map((friend) => (
                <div key={friend.id} className="text-center">
                  <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700 truncate">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">캘린더</h3>
            <p className="text-gray-500 text-sm">캘린더 위젯</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundColor: bannerColor,
          backgroundBlendMode: 'overlay',
        }}
      >
        {isOwner && (
          <button
            onClick={() => setShowBannerCustomize(!showBannerCustomize)}
            className="absolute top-4 right-4 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-md flex items-center gap-2 transition-colors z-10"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">배너 설정</span>
          </button>
        )}

        {showBannerCustomize && isOwner && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-xl p-4 w-80 z-10">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">배너 색상</label>
              <div className="flex gap-2">
                {['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBannerColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 ${bannerColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'} transition-all`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지 URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="이미지 URL을 입력하세요"
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{userId || 'user'}</h1>
              <p className="text-gray-600 mb-3">@{userId || 'user'}</p>
              <div className="flex gap-6 text-sm justify-center">
                <span className="text-gray-700"><strong className="text-gray-900">142</strong> 친구</span>
                <span className="text-gray-700"><strong className="text-gray-900">28</strong> 게시물</span>
                <span className="text-gray-700"><strong className="text-gray-900">1,523</strong> 방문자</span>
              </div>
            </div>

            {isOwner && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isEditMode
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isEditMode ? (
                  <>
                    <Save className="w-4 h-4" />
                    저장
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    편집 모드
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgets.sort((a, b) => a.position - b.position).map((widget) => (
            <div key={widget.id} className="relative group">
              {isEditMode && isOwner && (
                <div className="absolute -top-2 -right-2 z-10 flex gap-2">
                  <button className="w-8 h-8 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWidgets(widgets.filter((w) => w.id !== widget.id))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {renderWidget(widget)}
            </div>
          ))}
        </div>

        {isOwner && (
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}

        {isEditMode && isOwner && (
          <div className="mt-6">
            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600">
              <Plus className="w-5 h-5" />
              <span className="font-medium">위젯 추가</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
