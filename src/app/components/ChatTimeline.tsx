import { useState, useRef, useEffect } from 'react';
import { Image, Plus, Send } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Message {
  id: string;
  user: string;
  content: string;
  image?: string;
  timestamp?: string;
  type: 'text' | 'image';
}

interface ChatTimelineProps {
  onAISummaryClick?: () => void;
  serverId?: string;
  user?: any;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a25a4117`;

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
};

export function ChatTimeline({ onAISummaryClick, serverId = '1', user }: ChatTimelineProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [serverId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/messages/${serverId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || loading) return;

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '익명';

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          serverId,
          user: userName,
          content: inputText,
          type: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages([...messages, data.message]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || loading) return;

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '익명';

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            serverId,
            user: userName,
            content: '',
            image: imageUrl,
            type: 'image',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send image');
        }

        const data = await response.json();
        setMessages([...messages, data.message]);
      } catch (error) {
        console.error('Error sending image:', error);
        alert('이미지 전송에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header - Desktop only */}
      <div className="hidden md:block px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-800"># 오늘의 기록</h2>
            <p className="text-sm text-gray-600">2026.05.09 우리의 하루</p>
          </div>
          <button
            onClick={onAISummaryClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow">
            AI 요약 생성
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pt-16 md:pt-0 pb-20 md:pb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {message.user[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-800">{message.user}</span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp ? formatTime(message.timestamp) : '방금'}
                  </span>
                </div>
                {message.type === 'text' ? (
                  <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-2 max-w-md">
                    <img
                      src={message.image}
                      alt="uploaded"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 mb-16 md:mb-0">
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Image className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="오늘의 순간을 기록하세요..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === ''}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
