import { X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../utils/supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [serverName, setServerName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  if (!isOpen) return null;

  const handleCreateServer = async () => {
    if (!serverName.trim()) {
      alert('서버 이름을 입력해주세요.');
      return;
    }

    // TODO: 서버 생성 로직 구현
    alert(`"${serverName}" 서버가 생성되었습니다!`);
    setServerName('');
  };

  const handleJoinServer = async () => {
    if (!inviteCode.trim()) {
      alert('초대 코드를 입력해주세요.');
      return;
    }

    // TODO: 서버 참여 로직 구현
    alert(`초대 코드 "${inviteCode}"로 서버에 참여했습니다!`);
    setInviteCode('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">DAYSERVER</h2>
          <p className="text-gray-400 text-sm">
            하루를 카드 누스로 남기는 가장<br />쉬운 방법
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-3">서버 만들기</h3>
            <p className="text-gray-400 text-sm mb-3">
              친구들로 시작된 소규모 서버로 부터 많은 유저와 대화
            </p>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="서버 이름을 입력 후.."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
            />
            <button
              onClick={handleCreateServer}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              서버 만들기
            </button>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">서버 참여하기</h3>
            <p className="text-gray-400 text-sm mb-3">
              친구 초대코드를 입력해 기존 (ㅇㅇㅇㅇㅇㅇㅇ) 을 참여하세요.
            </p>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="초대코드 입력"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
            />
            <button
              onClick={handleJoinServer}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              초대받은 서버
            </button>
          </div>

          <div className="pt-4">
            <h3 className="text-white font-semibold mb-3 text-center">내 서버 목록</h3>
            <div className="space-y-2">
              <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                <div>
                  <p className="text-white text-sm font-medium">ㅇㅇㅇ</p>
                  <p className="text-gray-400 text-xs">Image 256 • 카테고리: 무</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-sm">+ 제작 보기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
