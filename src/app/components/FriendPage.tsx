import { useState } from 'react';
import { Calendar, Heart, MessageCircle, Settings, Palette } from 'lucide-react';

interface FriendPageProps {
  friendId: string;
  isOwner?: boolean;
}

interface Post {
  id: string;
  type: 'highlight' | 'photo';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  date: string;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
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
    type: 'photo',
    content: 'MT에서 찍은 단체 사진!',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    likes: 42,
    comments: 12,
    liked: true,
    date: '2026-04-25',
  },
  {
    id: '3',
    type: 'highlight',
    content: '오늘 처음으로 서핑을 배웠어요. 너무 재밌었어요!',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    likes: 31,
    comments: 8,
    liked: false,
    date: '2026-05-03',
  },
];

const friendProfile = {
  name: '김민수',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  bio: '여행과 사진을 좋아하는 개발자 🌍📸',
  backgroundColor: '#8B5CF6',
  textColor: '#FFFFFF',
};

export function FriendPage({ friendId, isOwner = false }: FriendPageProps) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCustomize, setShowCustomize] = useState(false);
  const [bgColor, setBgColor] = useState(friendProfile.backgroundColor);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col">
      {/* Header with custom background */}
      <div
        className="p-8 text-white relative"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={friendProfile.avatar}
                alt={friendProfile.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{friendProfile.name}</h1>
                <p className="text-white/90">{friendProfile.bio}</p>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => setShowCustomize(!showCustomize)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span>커스터마이징</span>
              </button>
            )}
          </div>

          {showCustomize && isOwner && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">페이지 커스터마이징</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2">배경 색상</label>
                  <div className="flex gap-2">
                    {['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                      <button
                        key={color}
                        onClick={() => setBgColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 ${bgColor === color ? 'border-white scale-110' : 'border-white/30'} transition-all`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold">{posts.length}</span>
              <span className="ml-1 text-white/80">게시물</span>
            </div>
            <div>
              <span className="font-semibold">142</span>
              <span className="ml-1 text-white/80">친구</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                <img
                  src={friendProfile.avatar}
                  alt={friendProfile.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{friendProfile.name}</p>
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
    </div>
  );
}
