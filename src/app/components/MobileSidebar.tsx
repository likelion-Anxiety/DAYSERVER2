import { Calendar, Hash, Plus, Sparkles, UserPlus, X } from 'lucide-react';
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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
  onServerClick: (serverId: string) => void;
  onHomeClick: () => void;
  onCalendarClick?: () => void;
  onFriendClick?: (friendId: string) => void;
}

export function MobileSidebar({
  isOpen,
  onClose,
  onOpenModal,
  onServerClick,
  onHomeClick,
  onCalendarClick,
  onFriendClick,
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 md:hidden" onClick={onClose} />

      <aside className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#f7f1e8] border-r border-[#d7c9b8] flex flex-col md:hidden">
        <div className="p-5 border-b border-[#dacdbc] bg-white/55 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onHomeClick();
                onClose();
              }}
              className="flex items-center gap-2"
            >
              <img src={logoIcon} alt="DAYSERVER" className="size-10 rounded-xl" />
              <div className="text-left">
                <p className="text-[11px] tracking-[0.16em] text-[#6f7b83]">DAYSERVER</p>
                <p className="text-base font-semibold text-[#253037]">Memory Archive</p>
              </div>
            </button>
            <button onClick={onClose} className="size-9 rounded-full border border-[#cdbca7] text-[#455760] inline-flex items-center justify-center">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#dacdbc] space-y-2">
          <button
            onClick={() => {
              onOpenModal();
              onClose();
            }}
            className="w-full inline-flex items-center gap-2 rounded-xl bg-[#253037] px-3 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            서버 만들기
          </button>
          <button
            onClick={() => {
              onOpenModal();
              onClose();
            }}
            className="w-full inline-flex items-center gap-2 rounded-xl border border-[#cab8a2] bg-[#fbf5eb] px-3 py-2.5 text-sm font-semibold text-[#4e5d65]"
          >
            <UserPlus className="size-4" />
            서버 참여하기
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <section>
            <h2 className="mb-2 px-2 text-[11px] tracking-[0.16em] text-[#748189]">CALENDAR</h2>
            <button
              onClick={() => {
                if (onCalendarClick) {
                  onCalendarClick();
                  onClose();
                }
              }}
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
                  className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#eee3d3] transition-colors"
                  onClick={() => {
                    onServerClick(channel.id);
                    onClose();
                  }}
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
            <h2 className="mb-2 px-2 text-[11px] tracking-[0.16em] text-[#748189]">FRIENDS</h2>
            <div className="space-y-1.5">
              {[
                { id: '1', name: '김민수', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', online: true },
                { id: '2', name: '이지은', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', online: true },
                { id: '3', name: '박서준', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', online: false },
                { id: '4', name: '최수영', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', online: true },
              ].map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => {
                    if (onFriendClick) {
                      onFriendClick(friend.id);
                      onClose();
                    }
                  }}
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
          </section>
        </div>

        <div className="p-4 border-t border-[#dacdbc] bg-white/55">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#8c4d3f] text-white flex items-center justify-center font-semibold">나</div>
            <div>
              <p className="text-sm font-semibold text-[#2c3a42]">형진</p>
              <p className="text-xs text-[#798790]">온라인</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
