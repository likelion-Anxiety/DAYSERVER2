import { X, Hash, Sparkles, Image as ImageIcon } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  date: string;
  displayType: 'text' | 'highlight' | 'image';
  thumbnail?: string;
  color?: string;
}

interface DateServersModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  servers: Server[];
  onServerClick: (serverId: string) => void;
}

export function DateServersModal({
  isOpen,
  onClose,
  date,
  servers,
  onServerClick,
}: DateServersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{date}</h2>
              <p className="text-sm text-gray-600 mt-1">
                이 날짜의 서버 {servers.length}개
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
          <div className="space-y-3">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => {
                  onServerClick(server.id);
                  onClose();
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  {server.displayType === 'image' && server.thumbnail ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={server.thumbnail} alt={server.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${server.color || 'bg-gray-200'}`}>
                      {server.displayType === 'text' && <Hash className="w-8 h-8 text-white" />}
                      {server.displayType === 'highlight' && <Sparkles className="w-8 h-8 text-white" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600 truncate">
                      {server.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {server.displayType === 'text' && '텍스트 표시'}
                      {server.displayType === 'highlight' && '하이라이트 표시'}
                      {server.displayType === 'image' && '이미지 표시'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
