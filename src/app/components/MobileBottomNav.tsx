import { Calendar, Home, Menu, Sparkles, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
}

export function MobileBottomNav({ activeTab, onTabChange, onMenuClick }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#d8cbbb] bg-[#fffdf9]/95 px-3 py-2 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around">
        {[
          { key: 'home', label: '홈', icon: Home },
          { key: 'calendar', label: '캘린더', icon: Calendar },
          { key: 'ai', label: 'AI요약', icon: Sparkles },
          { key: 'profile', label: '프로필', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors ${
                active ? 'text-[#8c4d3f]' : 'text-[#687882]'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onMenuClick}
          className="flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[#687882] transition-colors"
        >
          <Menu className="size-5" />
          <span className="text-[11px] font-medium">메뉴</span>
        </button>
      </div>
    </div>
  );
}
