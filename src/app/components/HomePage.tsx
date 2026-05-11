import { Sparkles, TrendingUp, Zap, ChevronRight, Heart, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

interface HomePageProps {
  onServerClick: (serverId: string) => void;
  onCreateServerClick?: () => void;
}

interface FriendPost {
  id: string;
  friendName: string;
  friendAvatar: string;
  type: 'highlight' | 'photo';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  date: string;
}

const serverRecommendations = [
  { id: '1', name: '제주도 여행 2024', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400', members: 5 },
  { id: '2', name: '여름 MT 2024', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', members: 8 },
  { id: '3', name: '부산 맛집 탐방', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', members: 6 },
];

const templates = [
  { id: '1', title: '여행 기록', icon: '✈️', color: 'from-blue-400 to-blue-600' },
  { id: '2', title: 'MT 추억', icon: '🏕️', color: 'from-green-400 to-green-600' },
  { id: '3', title: '맛집 탐방', icon: '🍜', color: 'from-orange-400 to-orange-600' },
  { id: '4', title: '일상 기록', icon: '📝', color: 'from-purple-400 to-purple-600' },
];

const aiHighlights = [
  { id: '1', title: '제주 바다에서 찍은 인생샷', emoji: '🌊', server: 'DB DAYSERVER' },
  { id: '2', title: '여름 MT 2024', emoji: '⛺', server: 'DB DAYSERVER' },
  { id: '3', title: '김민수 생일', emoji: '🎂', server: 'DB DAYSERVER' },
  { id: '4', title: '송별회 in 서울', emoji: '🥂', server: 'DB DAYSERVER' },
];

const friendPosts: FriendPost[] = [
  {
    id: '1',
    friendName: '김민수',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    type: 'highlight',
    content: '제주도에서 맛있는 흑돼지를 먹었어요! 정말 최고였습니다 👍',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    likes: 24,
    comments: 5,
    liked: false,
    date: '2026-05-06',
  },
  {
    id: '2',
    friendName: '이지은',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    type: 'photo',
    content: 'MT에서 찍은 단체 사진! 너무 즐거웠어요 ㅎㅎ',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    likes: 42,
    comments: 12,
    liked: false,
    date: '2026-04-25',
  },
  {
    id: '3',
    friendName: '최수영',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    type: 'highlight',
    content: '오늘 처음으로 서핑을 배웠어요. 너무 재밌었어요!',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    likes: 31,
    comments: 8,
    liked: false,
    date: '2026-05-03',
  },
];

export function HomePage({ onServerClick, onCreateServerClick }: HomePageProps) {
  const [posts, setPosts] = useState<FriendPost[]>(friendPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          좋아진 여러분,
        </h2>
        <p className="text-gray-600 mb-4">
          우리만의 하이라이트로 빛나는<br />
          추억들을 만들어보세요!
        </p>

        {/* Featured Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-40 h-52 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"
              alt="Highlight 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-shrink-0 w-40 h-52 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400"
              alt="Highlight 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-shrink-0 w-40 h-52 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <p className="text-lg font-bold mb-2">새로운<br />추억들로</p>
              <p className="text-sm">채워보세요</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onCreateServerClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
          >
            새 서버 만들기
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            모든 활동 보기
          </button>
        </div>
      </div>

      {/* Friends Feed */}
      <div className="p-6 border-b-8 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">친구들의 하이라이트</h3>
          <button className="text-sm text-purple-600 hover:text-purple-700">
            더보기 →
          </button>
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <img
                  src={post.friendAvatar}
                  alt={post.friendName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{post.friendName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                    {post.type === 'highlight' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                        하이라이트
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full aspect-video object-cover"
                />
              )}

              <div className="p-4">
                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      post.liked
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-pink-600' : ''}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Server Recommendations */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">서버 추천</h3>
          <button className="text-sm text-purple-600 hover:text-purple-700">
            더보기 →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {serverRecommendations.map((server) => (
            <button
              key={server.id}
              onClick={() => onServerClick(server.id)}
              className="flex-shrink-0 w-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={server.image}
                alt={server.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 bg-white">
                <p className="text-sm font-semibold text-gray-800 mb-1">{server.name}</p>
                <p className="text-xs text-gray-500">👥 {server.members}명 참여중</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">추천 템플릿</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-gradient-to-br ${template.color} rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <p className="text-sm font-semibold">{template.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Highlights */}
      <div className="px-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-800">AI 선정 명장면</h3>
          </div>
          <button className="text-sm text-purple-600 hover:text-purple-700">
            더보기 →
          </button>
        </div>

        <div className="space-y-2">
          {aiHighlights.map((highlight) => (
            <button
              key={highlight.id}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                {highlight.emoji}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">{highlight.title}</p>
                <p className="text-xs text-gray-500">{highlight.server}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
