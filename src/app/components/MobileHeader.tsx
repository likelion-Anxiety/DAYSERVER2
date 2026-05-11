import { Menu, Search, Sparkles } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  channelName: string;
}

export function MobileHeader({ onMenuClick, channelName }: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 z-30 md:hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center text-white"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h1 className="font-bold text-white">{channelName}</h1>
          </div>
          <p className="text-xs text-white/80">2026.05.09</p>
        </div>

        <button className="w-10 h-10 flex items-center justify-center text-white">
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
