import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Hash, Image as ImageIcon, Sparkles, MoreHorizontal } from 'lucide-react';
import { ServerDisplaySettingsModal } from './ServerDisplaySettingsModal';
import { ServerSelectorModal } from './ServerSelectorModal';
import { DateServersModal } from './DateServersModal';
import { functionName, projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Server {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  displayType: 'text' | 'highlight' | 'image';
  thumbnail?: string;
  color?: string;
}

interface CalendarViewProps {
  onServerClick: (serverId: string) => void;
}

// Mock data
const initialMockServers: Server[] = [
  { id: '1', name: '오늘의 기록', date: '2026-05-09', displayType: 'text', color: 'bg-purple-500' },
  { id: '2', name: '제주도 여행', date: '2026-05-06', displayType: 'text', color: 'bg-blue-500' },
  { id: '3', name: 'MT 추억', date: '2026-04-25', displayType: 'text', color: 'bg-pink-500' },
  { id: '4', name: '생일 파티', date: '2026-05-09', displayType: 'text', color: 'bg-green-500' },
];

const API_BASE = `https://${projectId}.supabase.co/functions/v1/${functionName}`;
const LOCAL_SETTINGS_KEY = 'dayserver-calendar-settings';

type ServerSetting = {
  serverId: string;
  displayType: 'text' | 'highlight' | 'image';
  thumbnail?: string;
};

const readLocalSettings = (): ServerSetting[] => {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalSettings = (settings: ServerSetting[]) => {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore localStorage write errors
  }
};

export function CalendarView({ onServerClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [servers, setServers] = useState<Server[]>(initialMockServers);
  const [loading, setLoading] = useState(true);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [selectedDisplayType, setSelectedDisplayType] = useState<'text' | 'highlight' | 'image'>('text');
  const [dateServersModal, setDateServersModal] = useState<{
    isOpen: boolean;
    date: string;
    servers: Server[];
  } | null>(null);
  const [settingsModal, setSettingsModal] = useState<{
    isOpen: boolean;
    serverId: string;
    serverName: string;
    currentDisplayType: 'text' | 'highlight' | 'image';
    currentThumbnail?: string;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getServersForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return servers.filter(server => server.date === dateStr);
  };

  const handleDisplayTypeClick = (type: 'text' | 'highlight' | 'image') => {
    setSelectedDisplayType(type);
    setShowServerSelector(true);
  };

  const handleServerSelect = (server: Server) => {
    setShowServerSelector(false);
    setSettingsModal({
      isOpen: true,
      serverId: server.id,
      serverName: server.name,
      currentDisplayType: selectedDisplayType,
      currentThumbnail: server.thumbnail,
    });
  };

  // Load server settings from Supabase
  useEffect(() => {
    loadServerSettings();
  }, []);

  const loadServerSettings = async () => {
    try {
      setLoading(true);
      let loadedSettings: ServerSetting[] = [];

      const response = await fetch(`${API_BASE}/server-settings`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings && Array.isArray(data.settings)) {
          loadedSettings = data.settings;
          writeLocalSettings(loadedSettings);
        }
      }

      if (loadedSettings.length === 0) {
        loadedSettings = readLocalSettings();
      }

      const updatedServers = initialMockServers.map(server => {
        const savedSetting = loadedSettings.find((s: any) => s.serverId === server.id);
        if (savedSetting) {
          return {
            ...server,
            displayType: savedSetting.displayType,
            thumbnail: savedSetting.thumbnail,
          };
        }
        return server;
      });
      setServers(updatedServers);
    } catch (error) {
      console.error('Error loading server settings:', error);
      const localSettings = readLocalSettings();
      const updatedServers = initialMockServers.map(server => {
        const savedSetting = localSettings.find((s: any) => s.serverId === server.id);
        if (savedSetting) {
          return {
            ...server,
            displayType: savedSetting.displayType,
            thumbnail: savedSetting.thumbnail,
          };
        }
        return server;
      });
      setServers(updatedServers);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (serverId: string, displayType: 'text' | 'highlight' | 'image', thumbnail?: string) => {
    setServers(prevServers =>
      prevServers.map(server =>
        server.id === serverId
          ? { ...server, displayType, thumbnail }
          : server
      )
    );

    const upsertLocal = () => {
      const localSettings = readLocalSettings();
      const existingIndex = localSettings.findIndex((setting) => setting.serverId === serverId);
      const nextSetting: ServerSetting = { serverId, displayType, thumbnail };

      if (existingIndex >= 0) {
        localSettings[existingIndex] = nextSetting;
      } else {
        localSettings.push(nextSetting);
      }
      writeLocalSettings(localSettings);
    };

    try {
      const response = await fetch(`${API_BASE}/server-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          serverId,
          displayType,
          thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save server settings');
      }

      upsertLocal();
    } catch (error) {
      console.error('Error saving server settings:', error);
      upsertLocal();
      alert('서버 저장에 실패해 로컬에 임시 저장했습니다.');
    }
  };

  const renderDays = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDayOfWeek + 1;

      if (i < startDayOfWeek || dayNumber > daysInMonth) {
        days.push(
          <div key={i} className="aspect-square bg-gray-50">
          </div>
        );
      } else {
        const dateServers = getServersForDate(dayNumber);
        const isToday =
          dayNumber === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear();

        const primaryServer = dateServers[0];
        const hasMoreServers = dateServers.length > 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

        days.push(
          <div
            key={i}
            className={`aspect-square border border-gray-200 relative overflow-hidden ${
              isToday ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            {/* ?대?吏 ??? ?꾩껜瑜??대?吏濡?梨꾩? */}
            {primaryServer?.displayType === 'image' && primaryServer.thumbnail ? (
              <>
                <button
                  onClick={() => onServerClick(primaryServer.id)}
                  className="w-full h-full relative group"
                >
                  <img
                    src={primaryServer.thumbnail}
                    alt={primaryServer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {dayNumber}
                  </div>
                </button>
                {hasMoreServers && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDateServersModal({
                        isOpen: true,
                        date: dateStr,
                        servers: dateServers,
                      });
                    }}
                    className="absolute bottom-1 right-1 bg-black/70 hover:bg-black/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                    <span>+{dateServers.length - 1}</span>
                  </button>
                )}
              </>
            ) : (
              /* ?띿뒪???섏씠?쇱씠????? 湲곗〈 諛⑹떇 */
              <div className={`w-full h-full p-2 ${isToday ? 'bg-purple-50' : 'bg-white'}`}>
                <div className={`text-xs md:text-sm font-medium mb-1 ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                  {dayNumber}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-12 md:max-h-20">
                  {dateServers.slice(0, hasMoreServers ? 1 : dateServers.length).map(server => (
                    <button
                      key={server.id}
                      onClick={() => onServerClick(server.id)}
                      className={`w-full text-left px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium text-white truncate ${server.color} hover:opacity-80 transition-opacity`}
                    >
                      {server.displayType === 'text' && (
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <Hash className="w-2 h-2 md:w-3 md:h-3" />
                          <span className="truncate">{server.name}</span>
                        </span>
                      )}
                      {server.displayType === 'highlight' && (
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <Sparkles className="w-2 h-2 md:w-3 md:h-3" />
                          <span className="truncate">{server.name}</span>
                        </span>
                      )}
                    </button>
                  ))}
                  {hasMoreServers && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDateServersModal({
                          isOpen: true,
                          date: dateStr,
                          servers: dateServers,
                        });
                      }}
                      className="w-full text-left px-1 md:px-2 py-0.5 md:py-1 bg-gray-300 hover:bg-gray-400 rounded text-[10px] md:text-xs font-medium text-gray-700 transition-colors flex items-center gap-1"
                    >
                      <MoreHorizontal className="w-2 h-2 md:w-3 md:h-3" />
                      <span>+{dateServers.length - 1}개 더보기</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }
    }

    return days;
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  if (loading) {
    return (
      <div className="flex-1 bg-white h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">캘린더 설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">서버 캘린더</h1>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-base md:text-lg font-semibold text-gray-900 min-w-24 md:min-w-32 text-center">
              {year}년 {monthNames[month]}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          서버를 클릭하면 해당 서버로 이동합니다.
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-2 md:p-6 pb-20 md:pb-6">
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day Names */}
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`p-3 text-center text-sm font-semibold ${
                index === 0 ? 'text-red-600 bg-red-50' : index === 6 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 bg-gray-100'
              }`}
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {renderDays()}
        </div>
      </div>

      {/* Date Servers Modal */}
      {dateServersModal && (
        <DateServersModal
          isOpen={dateServersModal.isOpen}
          onClose={() => setDateServersModal(null)}
          date={dateServersModal.date}
          servers={dateServersModal.servers}
          onServerClick={onServerClick}
        />
      )}

      {/* Server Selector Modal */}
      <ServerSelectorModal
        isOpen={showServerSelector}
        onClose={() => setShowServerSelector(false)}
        servers={servers}
        onSelectServer={handleServerSelect}
        displayType={selectedDisplayType}
      />

      {/* Settings Modal */}
      {settingsModal && (
        <ServerDisplaySettingsModal
          isOpen={settingsModal.isOpen}
          onClose={() => setSettingsModal(null)}
          serverId={settingsModal.serverId}
          serverName={settingsModal.serverName}
          currentDisplayType={settingsModal.currentDisplayType}
          currentThumbnail={settingsModal.currentThumbnail}
          onSave={(displayType, thumbnail) => {
            handleSaveSettings(settingsModal.serverId, displayType, thumbnail);
          }}
        />
      )}

      {/* Legend */}
      <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">표시 방식 변경</h3>
        <p className="text-xs text-gray-500 mb-3">아래 버튼을 클릭해 서버 표시 방식을 변경하세요.</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleDisplayTypeClick('text')}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
              <Hash className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">텍스트로 표시</span>
          </button>
          <button
            onClick={() => handleDisplayTypeClick('highlight')}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
          >
            <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">하이라이트로 표시</span>
          </button>
          <button
            onClick={() => handleDisplayTypeClick('image')}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">이미지로 표시</span>
          </button>
        </div>
      </div>
    </div>
  );
}



