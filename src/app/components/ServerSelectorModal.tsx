import { X, Calendar as CalendarIcon } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  date: string;
  color?: string;
}

interface ServerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: Server[];
  onSelectServer: (server: Server) => void;
  displayType: 'text' | 'highlight' | 'image';
}

export function ServerSelectorModal({
  isOpen,
  onClose,
  servers,
  onSelectServer,
  displayType,
}: ServerSelectorModalProps) {
  if (!isOpen) return null;

  const displayTypeText = {
    text: '텍스트',
    highlight: '하이라이트',
    image: '이미지',
  }[displayType];

  // 날짜별로 그룹화
  const serversByDate = servers.reduce((acc, server) => {
    if (!acc[server.date]) {
      acc[server.date] = [];
    }
    acc[server.date].push(server);
    return acc;
  }, {} as Record<string, Server[]>);

  const sortedDates = Object.keys(serversByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">서버/날짜 선택</h2>
              <p className="text-sm text-gray-600 mt-1">
                {displayTypeText}로 표시할 서버를 선택하세요
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">서버가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {date}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serversByDate[date].map((server) => (
                      <button
                        key={server.id}
                        onClick={() => onSelectServer(server)}
                        className={`p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group ${server.color}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${server.color || 'bg-gray-200'}`}>
                            <span className="text-white font-bold text-lg">#</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 group-hover:text-purple-600">
                              {server.name}
                            </p>
                            <p className="text-xs text-gray-500">{date}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
