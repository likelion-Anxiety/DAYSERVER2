import { Home, Calendar, Sparkles, User, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
}

export function MobileBottomNav({ activeTab, onTabChange, onMenuClick }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30 md:hidden">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">홈</span>
        </button>

        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'calendar' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">캘린더</span>
        </button>

        <button
          onClick={() => onTabChange('ai')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'ai' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-xs font-medium">AI요약</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'profile' ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">프로필</span>
        </button>

        <button
          onClick={onMenuClick}
          className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-gray-500 transition-colors"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs font-medium">메뉴</span>
        </button>
      </div>
    </div>
  );
}
