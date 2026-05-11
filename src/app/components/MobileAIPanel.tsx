import { Sparkles, Heart, Trophy, MessageSquare, Download, Gift, X } from 'lucide-react';

interface SummaryItem {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
}

const summaryItems: SummaryItem[] = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: '오늘의 사건 TOP 3',
    content: '1. 바다 여행 (시작 14:30)\n2. 재밌던 순간들\n3. 다같이 놀았어요',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: '오늘의 명대사',
    content: '"오늘 바다 왔어!" - 형진',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: '오늘의 주인공',
    content: '은미 (사진 1장 업로드)',
    color: 'from-pink-400 to-rose-400',
  },
];

const memCards = [
  {
    id: '1',
    title: '바다의 추억',
    emoji: '🌊',
    color: 'from-blue-400 to-cyan-300',
  },
  {
    id: '2',
    title: '즐거운 하루',
    emoji: '✨',
    color: 'from-purple-400 to-pink-300',
  },
  {
    id: '3',
    title: '우리의 순간',
    emoji: '💕',
    color: 'from-pink-400 to-rose-300',
  },
];

interface MobileAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileAIPanel({ isOpen, onClose }: MobileAIPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed left-0 right-0 bottom-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-3xl z-50 max-h-[90vh] flex flex-col md:hidden overflow-hidden">
        {/* Handle */}
        <div className="flex items-center justify-center py-3 border-b border-purple-200">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">AI 요약 결과</h2>
                <p className="text-xs text-gray-600">2026.05.09 오늘의 하루</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Today's Mood */}
          <div className="p-6 border-b border-purple-200">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4">
              <p className="text-xs text-purple-600 font-semibold mb-2">오늘의 분위기 🎭</p>
              <p className="font-bold text-lg text-gray-800 mb-2">
                즐거움 😊 기쁨 🎉 힐링 🌊
              </p>
              <p className="text-sm text-gray-700">
                바다에서 친구들과 함께한 즐거운 하루였어요!
              </p>
            </div>
          </div>

          {/* Summary Items */}
          <div className="p-6 space-y-4 border-b border-purple-200">
            <h3 className="text-sm font-semibold text-purple-600 mb-3">하이라이트</h3>
            {summaryItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white`}>
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">{item.title}</h4>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Meme Cards */}
          <div className="p-6 pb-8">
            <h3 className="text-sm font-semibold text-purple-600 mb-3">밈 카드</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {memCards.map((card) => (
                <div
                  key={card.id}
                  className={`aspect-square bg-gradient-to-br ${card.color} rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                >
                  <span className="text-2xl mb-1">{card.emoji}</span>
                  <span className="text-xs text-white font-medium text-center px-1">
                    {card.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                Gift
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
