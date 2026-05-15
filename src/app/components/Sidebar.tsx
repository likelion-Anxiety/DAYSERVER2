import { Calendar, ChevronDown, ChevronUp, Hash, Plus, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import logoIcon from '../../imports/_______.png';

interface Channel {
  id: string;
  name: string;
  date: string;
}

const channels: Channel[] = [
  { id: '1', name: '오늘의 기록', date: '2026.05.09' },
  { id: '2', name: '제주도 여행', date: '2026.05.06' },
  { id: '3', name: 'MT 추억', date: '2026.04.25' },
];

interface SidebarProps {
  onOpenModal: () => void;
  onServerClick: (serverId: string) => void;
  onHomeClick: () => void;
  onCalendarClick: () => void;
  onFriendClick: (friendId: string) => void;
  onMyPageClick: () => void;
  user?: any;
}

export function Sidebar({
  onOpenModal,
  onServerClick,
  onHomeClick,
  onCalendarClick,
  onFriendClick,
  onMyPageClick,
  user,
}: SidebarProps) {
  const [showFriends, setShowFriends] = useState(true);

  return (
    <aside className="w-72 h-full flex flex-col border-r border-[#d4c6b4] bg-[#f8f2e9]/90 backdrop-blur-sm">
      <button onClick={onHomeClick} className="w-full px-6 py-6 border-b border-[#dbcdbb] text-left hover:bg-white/40 transition-colors">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="DAYSERVER" className="size-10 rounded-xl" />
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#6f7b83]">DAYSERVER</p>
            <h1 className="text-xl font-semibold text-[#253037]">Memory Archive</h1>
          </div>
        </div>
      </button>

      <div className="p-4 border-b border-[#dbcdbb] space-y-2.5">
        <button
          onClick={onOpenModal}
          className="w-full inline-flex items-center gap-2 rounded-xl bg-[#253037] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#1d252b] transition-colors"
        >
          <Plus className="size-4" />
          서버 만들기
        </button>
        <button
          onClick={onOpenModal}
          className="w-full inline-flex items-center gap-2 rounded-xl border border-[#c8b7a1] bg-[#fdf8f0] px-3 py-2.5 text-sm font-semibold text-[#4d5c64] hover:bg-[#f4ecdf] transition-colors"
        >
          <UserPlus className="size-4" />
          서버 참여하기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h2 className="mb-2 px-2 text-[11px] tracking-[0.16em] text-[#748189]">CALENDAR</h2>
          <button
            onClick={onCalendarClick}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#33454d] hover:bg-[#eee3d3] transition-colors inline-flex items-center gap-2"
          >
            <Calendar className="size-4 text-[#4f6a79]" />
            서버 캘린더
          </button>
        </section>

        <section>
          <h2 className="mb-2 px-2 text-[11px] tracking-[0.16em] text-[#748189]">CHANNEL</h2>
          <div className="space-y-1.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onServerClick(channel.id)}
                className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#eee3d3] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Hash className="size-4 text-[#7a4b3f]" />
                  <div>
                    <p className="text-sm font-medium text-[#2d3a42]">{channel.name}</p>
                    <p className="text-xs text-[#798790]">{channel.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 px-2 text-[11px] tracking-[0.16em] text-[#748189]">AI</h2>
          <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#33454d] hover:bg-[#eee3d3] transition-colors inline-flex items-center gap-2">
            <Sparkles className="size-4 text-[#a1604c]" />
            오늘의 밈 카드
          </button>
        </section>

        <section>
          <button
            onClick={() => setShowFriends((prev) => !prev)}
            className="mb-2 w-full inline-flex items-center justify-between rounded-lg px-2 py-1 text-[11px] tracking-[0.16em] text-[#748189] hover:bg-[#eee3d3]"
          >
            FRIENDS
            {showFriends ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>

          {showFriends && (
            <div className="space-y-1.5">
              {[
                { id: '1', name: '김민수', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', online: true },
                { id: '2', name: '이지은', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', online: true },
                { id: '3', name: '박서준', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', online: false },
                { id: '4', name: '최수영', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', online: true },
              ].map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => onFriendClick(friend.id)}
                  className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#eee3d3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="size-8 rounded-full border border-[#d4c7b6]" />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-white ${
                          friend.online ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#33454d]">{friend.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <button onClick={onMyPageClick} className="p-4 border-t border-[#dbcdbb] hover:bg-white/40 transition-colors w-full">
        <div className="flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="size-10 rounded-full object-cover border border-[#d4c7b6]"
            />
          ) : (
            <div className="size-10 rounded-full bg-[#8c4d3f] text-white flex items-center justify-center font-semibold">
              {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '나'}
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[#2c3a42]">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '게스트'}
            </p>
            <p className="text-xs text-[#798790]">{user ? '온라인' : '로그인 필요'}</p>
          </div>
        </div>
      </button>
    </aside>
  );
}
