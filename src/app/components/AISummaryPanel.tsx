import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Heart, Trophy, MessageSquare, Download, Gift } from 'lucide-react';
import { functionName, projectId, publicAnonKey } from '../../../utils/supabase/info';

interface AISummaryPanelProps {
  serverId?: string;
}

interface SummaryPayload {
  mood: string;
  topMoments: string[];
  quote: string;
  highlights: string[];
  imagePrompt?: string;
}

interface MemeCard {
  id: string;
  title: string;
  emoji?: string;
  prompt?: string;
  imageUrl?: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/${functionName}`;

const defaultSummary: SummaryPayload = {
  mood: '요약을 생성해보세요.',
  topMoments: ['대화 데이터 로딩 중'],
  quote: '대표 문장이 아직 없습니다.',
  highlights: ['AI 요약 버튼을 눌러주세요.'],
};

export function AISummaryPanel({ serverId = '1' }: AISummaryPanelProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryPayload>(defaultSummary);
  const [cards, setCards] = useState<MemeCard[]>([]);
  const [highlightImageUrl, setHighlightImageUrl] = useState<string | null>(null);

  const summaryItems = useMemo(
    () => [
      {
        icon: <Trophy className="w-5 h-5" />,
        title: '오늘의 사건 TOP 3',
        content: summary.topMoments.slice(0, 3).join('\n'),
        color: 'from-yellow-400 to-orange-400',
      },
      {
        icon: <MessageSquare className="w-5 h-5" />,
        title: '오늘의 명문장',
        content: summary.quote,
        color: 'from-blue-400 to-cyan-400',
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: '오늘의 하이라이트',
        content: summary.highlights.slice(0, 3).join('\n'),
        color: 'from-pink-400 to-rose-400',
      },
    ],
    [summary],
  );

  const generateImage = async (prompt: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  };

  const fetchAISummary = async (isManual = false) => {
    setLoading(true);
    if (isManual) {
      setHighlightImageUrl(null);
    }
    
    try {
      // 1. Fetch Summary (Cache-aware)
      const summaryRes = await fetch(`${API_BASE}/ai/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ 
          serverId,
          forceRefresh: isManual
        }),
      });

      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      const summaryData = await summaryRes.json();
      const nextSummary: SummaryPayload = summaryData.summary || defaultSummary;
      setSummary(nextSummary);

      // 2. Fetch Meme Cards definitions (Cache-aware)
      const memeRes = await fetch(`${API_BASE}/ai/meme-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ 
          serverId, 
          summary: nextSummary,
          forceRefresh: isManual
        }),
      });

      let nextCards: MemeCard[] = [];
      if (memeRes.ok) {
        const memeData = await memeRes.json();
        nextCards = Array.isArray(memeData.cards) ? memeData.cards : [];
        setCards(nextCards);
      }

      // 3. Generate Highlight Image in background (Only if we don't have one or manual)
      // Note: We don't cache images in KV to avoid size issues, but highlightImageUrl is in state.
      // If we got from cache, it's fine to re-generate images or just skip if we wanted to be more efficient.
      // For now, let's generate them to keep it alive.
      if (nextSummary.imagePrompt) {
        generateImage(nextSummary.imagePrompt).then(url => {
          if (url) setHighlightImageUrl(url);
        });
      }

      // 4. Generate Images for Meme Cards in background
      nextCards.forEach((card) => {
        if (card.prompt) {
          generateImage(card.prompt).then(url => {
            if (url) {
              setCards(prev => prev.map(c => c.id === card.id ? { ...c, imageUrl: url } : c));
            }
          });
        }
      });

    } catch (error) {
      console.error('AI summary error:', error);
      setSummary(defaultSummary);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAISummary(false);
  }, [serverId]);

  return (
    <div className="w-80 bg-gradient-to-br from-purple-50 to-pink-50 h-full flex flex-col border-l border-purple-200 overflow-y-auto">
      <div className="p-6 border-b border-purple-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg text-gray-800">AI 요약 결과</h2>
        </div>
        <button
          onClick={() => fetchAISummary(true)}
          disabled={loading}
          className="w-full py-2 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? '생성 중...' : 'AI 요약 다시 생성'}
        </button>
      </div>

      <div className="p-6 border-b border-purple-200">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 overflow-hidden">
          <p className="text-xs text-purple-600 font-semibold mb-2">오늘의 분위기 한 줄</p>
          <p className="font-bold text-lg text-gray-800 mb-4">{summary.mood}</p>
          {highlightImageUrl ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-white/50 mb-2">
              <img src={highlightImageUrl} alt="Highlight" className="w-full h-full object-cover" />
            </div>
          ) : (
            loading && (
              <div className="aspect-video w-full bg-white/30 rounded-xl animate-pulse flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
            )
          )}
        </div>
      </div>

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

      <div className="p-6">
        <h3 className="text-sm font-semibold text-purple-600 mb-3">밈 카드</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(cards.length ? cards : [
            { id: '1', title: '분위기', emoji: '✨' },
            { id: '2', title: '하이라이트', emoji: '🎯' },
            { id: '3', title: '추억', emoji: '📸' },
          ]).map((card) => (
            <div key={card.id} className="aspect-square bg-gradient-to-br from-purple-400 to-pink-300 rounded-lg flex flex-col items-center justify-center shadow-md overflow-hidden relative group">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <>
                  <span className="text-2xl mb-1">{card.emoji || '✨'}</span>
                  <span className="text-xs text-white font-medium text-center px-1">{card.title}</span>
                </>
              )}
              {card.imageUrl && (
                <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                  <span className="text-[10px] text-white font-bold truncate">{card.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download All
          </button>
          <button className="w-full py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" />
            Gift Cards
          </button>
        </div>
      </div>
    </div>
  );
}
