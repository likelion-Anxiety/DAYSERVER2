import { Menu, Search } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  channelName: string;
}

export function MobileHeader({ onMenuClick, channelName }: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 border-b border-[#d6c8b6] bg-[#f8f2e9]/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-between">
        <button onClick={onMenuClick} className="size-10 rounded-full border border-[#cfbfa9] text-[#33464f] inline-flex items-center justify-center">
          <Menu className="size-5" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="font-semibold text-[#253037]">{channelName}</h1>
          <p className="text-[11px] text-[#708089]">오늘의 기록 아카이브</p>
        </div>

        <button className="size-10 rounded-full border border-[#cfbfa9] text-[#33464f] inline-flex items-center justify-center">
          <Search className="size-5" />
        </button>
      </div>
    </div>
  );
}
