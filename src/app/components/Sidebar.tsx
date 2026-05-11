import { Calendar, Hash, Sparkles, Plus, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
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

export function Sidebar({ onOpenModal, onServerClick, onHomeClick, onCalendarClick, onFriendClick, onMyPageClick, user }: SidebarProps) {
  const [showFriends, setShowFriends] = useState(true);

  return (
    <div className="w-64 bg-gradient-to-br from-purple-50 to-pink-50 h-full flex flex-col border-r border-purple-200"
>

      {/* Logo */}
      <button onClick={onHomeClick} className="p-6 border-b border-purple-200 hover:bg-white/30 transition-colors text-left w-full">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="DAYSERVER" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div>
            <h1 className="font-bold text-lg text-purple-600">
              DAYSERVER
            </h1>
            <p className="text-xs text-purple-600">우리만의 추억 서버</p>
          </div>
        </div>
      </button>

      {/* Server Actions */}
      <div className="p-4 border-b border-purple-200 space-y-2">
        <button
          onClick={onOpenModal}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">서버 만들기</span>
        </button>
        <button
          onClick={onOpenModal}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">서버 참여하기</span>
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-purple-600 mb-2 px-2">캘린더</h2>
          <button
            onClick={onCalendarClick}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">서버 캘린더</span>
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-purple-600 mb-2 px-2">CHANNEL</h2>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onServerClick(channel.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-left group"
              >
                <Hash className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{channel.name}</p>
                  <p className="text-xs text-gray-500">{channel.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-purple-600 mb-2 px-2">AI 하이라이트</h2>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-gray-700">밈 카드</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowFriends(!showFriends)}
            className="w-full flex items-center justify-between px-2 mb-2 hover:bg-purple-100 rounded transition-colors"
          >
            <h2 className="text-xs font-semibold text-purple-600">친구</h2>
            {showFriends ? (
              <ChevronUp className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-600" />
            )}
          </button>
          {showFriends && (
            <div className="space-y-2">
              {[
                { id: '1', name: '김민수', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', online: true },
                { id: '2', name: '이지은', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', online: true },
                { id: '3', name: '박서준', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', online: false },
                { id: '4', name: '최수영', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', online: true },
              ].map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => onFriendClick(friend.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-left group"
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${friend.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{friend.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <button onClick={onMyPageClick} className="p-4 border-t border-purple-200 hover:bg-purple-100 transition-colors w-full">
        <div className="flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '나'}
              </span>
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-700">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '게스트'}
            </p>
            <p className="text-xs text-gray-500">{user ? '온라인' : '로그인 필요'}</p>
          </div>
        </div>
      </button>
    </div>
  );
}
