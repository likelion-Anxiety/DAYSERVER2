import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock3,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
} from 'lucide-react';

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

const heroMoments = [
  {
    id: '1',
    title: '제주 바다 앞 저녁 산책',
    subtitle: '파도 소리와 웃음이 같이 남은 날',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: '초여름 캠퍼스 피크닉',
    subtitle: '사진보다 오래 남는 순간들',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: '새벽까지 이어진 대화',
    subtitle: '서로의 하루를 꺼내놓던 밤',
    image: 'https://images.unsplash.com/photo-1516589091380-5d6010f2c9d6?w=1200&auto=format&fit=crop&q=80',
  },
];

const serverRecommendations = [
  {
    id: '1',
    name: '제주도 여행 2026',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    members: 8,
    updatedAt: '오늘 14:22',
  },
  {
    id: '2',
    name: '여름 MT 아카이브',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80',
    members: 11,
    updatedAt: '어제 22:18',
  },
  {
    id: '3',
    name: '동네 맛집 리포트',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80',
    members: 5,
    updatedAt: '5월 13일',
  },
];

const aiHighlights = [
  {
    id: '1',
    title: '5월 둘째 주, 가장 많이 웃은 순간 3가지',
    server: '제주도 여행 2026',
    emoji: '🌅',
  },
  {
    id: '2',
    title: 'MT에서 다시 보고 싶은 장면 모음',
    server: '여름 MT 아카이브',
    emoji: '🎞️',
  },
  {
    id: '3',
    title: '이번 달 대화 키워드: 설렘, 밤바다, 다음 계획',
    server: '오늘의 기록',
    emoji: '📝',
  },
];

const friendPosts: FriendPost[] = [
  {
    id: '1',
    friendName: '김민수',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    type: 'highlight',
    content:
      '노을 질 때 찍은 사진들 정리했어. 이번 여행은 사진보다 공기가 더 기억나는 것 같아.',
    image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&auto=format&fit=crop&q=80',
    likes: 26,
    comments: 7,
    liked: false,
    date: '2026-05-14',
  },
  {
    id: '2',
    friendName: '이지은',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    type: 'photo',
    content: '다음엔 같은 장소에서 같은 포즈로 다시 찍자. 비교하면 재밌을 듯!',
    image: 'https://images.unsplash.com/photo-1533844648-3c2d1e5fd8d1?w=1200&auto=format&fit=crop&q=80',
    likes: 39,
    comments: 11,
    liked: false,
    date: '2026-05-12',
  },
  {
    id: '3',
    friendName: '최수영',
    friendAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    type: 'highlight',
    content: 'AI 요약이 뽑아준 오늘의 문장: "우리는 같은 풍경을 보고 다른 이야기를 기억한다."',
    likes: 31,
    comments: 5,
    liked: false,
    date: '2026-05-10',
  },
];

export function HomePage({ onServerClick, onCreateServerClick }: HomePageProps) {
  const [posts, setPosts] = useState<FriendPost[]>(friendPosts);

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#d5c8b7] bg-[#fffaf2] p-6 sm:p-10 shadow-[0_24px_70px_-42px_rgba(32,42,48,0.65)] grain-overlay hero-reveal">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#ac6b57]/22 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#4b616f]/18 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs tracking-[0.22em] text-[#66757d]">MAY 2026 CURATION</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#1f282d] sm:text-6xl">
              기억은,
              <br />
              정리할수록
              <br />
              더 선명해집니다.
            </h2>
            <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-[#3e4f58]">
              DAYSERVER 메인은 단순한 피드가 아니라, 우리가 함께 보낸 하루를 다시 꺼내보는 전시 공간처럼 구성됩니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onCreateServerClick}
                className="inline-flex items-center gap-2 rounded-full bg-[#222c32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#182026]"
              >
                새 서버 만들기
                <ArrowRight className="size-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#bfae99] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#34464f] hover:bg-white">
                최근 하이라이트 보기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#d8cbbb] bg-white/75 p-4">
              <p className="text-xs text-[#6c7b84]">이번 주 저장된 장면</p>
              <p className="mt-2 text-3xl font-display text-[#1f282d]">48</p>
            </div>
            <div className="rounded-2xl border border-[#d8cbbb] bg-white/75 p-4">
              <p className="text-xs text-[#6c7b84]">활성 서버</p>
              <p className="mt-2 text-3xl font-display text-[#1f282d]">7</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-[#d8cbbb] bg-white/75 p-4">
              <p className="text-xs text-[#6c7b84]">오늘 추천 문장</p>
              <p className="mt-2 text-sm leading-relaxed text-[#33454e]">
                "같은 날을 보내도, 기억은 각자의 온도로 남는다."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 hero-reveal">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-[#1f282d]">Today&apos;s Moodboard</h3>
          <button className="text-sm font-medium text-[#7b4b3f]">전체 보기</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {heroMoments.map((moment) => (
            <article key={moment.id} className="group overflow-hidden rounded-2xl border border-[#d8ccbc] bg-[#fffdf9] shadow-[0_20px_45px_-35px_rgba(32,42,48,0.7)]">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-lg font-display text-[#fff6ea]">{moment.title}</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-[#51626b]">{moment.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl text-[#1f282d]">친구들의 최근 기록</h3>
            <button className="text-sm font-medium text-[#7b4b3f]">피드 더보기</button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-2xl border border-[#d7cab9] bg-[#fffdf9] shadow-[0_18px_45px_-34px_rgba(32,42,48,0.7)]">
                <div className="flex items-center gap-3 px-5 pt-5">
                  <img src={post.friendAvatar} alt={post.friendName} className="size-11 rounded-full border border-[#d6cab8] bg-white" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1f282d]">{post.friendName}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6c7b84]">
                      <Calendar className="size-3" />
                      <span>{post.date}</span>
                      {post.type === 'highlight' && (
                        <span className="rounded-full border border-[#cebba5] bg-[#f4e7d7] px-2 py-0.5 text-[11px] text-[#7b4b3f]">
                          하이라이트
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {post.image && <img src={post.image} alt="Post" className="mt-4 h-64 w-full object-cover" />}

                <div className="p-5">
                  <p className="text-sm leading-relaxed text-[#394a53]">{post.content}</p>

                  <div className="mt-4 flex items-center gap-3 border-t border-[#eadfcf] pt-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                        post.liked ? 'bg-[#f3ddd7] text-[#a1473f]' : 'bg-[#f5ede3] text-[#586973] hover:bg-[#eee4d8]'
                      }`}
                    >
                      <Heart className={`size-4 ${post.liked ? 'fill-[#a1473f]' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#f5ede3] px-3 py-1.5 text-sm text-[#586973] hover:bg-[#eee4d8]">
                      <MessageCircle className="size-4" />
                      {post.comments}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl text-[#1f282d]">추천 서버</h3>
              <button className="text-sm font-medium text-[#7b4b3f]">전체 서버</button>
            </div>

            <div className="space-y-3">
              {serverRecommendations.map((server) => (
                <button
                  key={server.id}
                  onClick={() => onServerClick(server.id)}
                  className="w-full overflow-hidden rounded-2xl border border-[#d7c9b8] bg-[#fffdf9] text-left shadow-[0_16px_40px_-35px_rgba(32,42,48,0.75)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="relative h-36">
                    <img src={server.image} alt={server.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/48 to-transparent" />
                    <p className="absolute bottom-3 left-3 text-base font-semibold text-[#fff8ef]">{server.name}</p>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm text-[#4f6069]">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4" />
                      {server.members}명 참여 중
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4" />
                      {server.updatedAt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-[#8c4d3f]" />
              <h3 className="text-xl text-[#1f282d]">AI 큐레이션</h3>
            </div>
            <div className="space-y-3">
              {aiHighlights.map((highlight) => (
                <button
                  key={highlight.id}
                  className="w-full rounded-2xl border border-[#d8cab8] bg-[#fffdf9] p-4 text-left shadow-[0_14px_35px_-33px_rgba(32,42,48,0.8)] transition-colors hover:bg-[#fcf6ee]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl border border-[#d7cab8] bg-[#f4e7d6] text-lg">
                      {highlight.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-relaxed text-[#2c3a42]">{highlight.title}</p>
                      <p className="mt-1 text-xs text-[#6b7a83]">{highlight.server}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
