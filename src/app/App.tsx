import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatTimeline } from './components/ChatTimeline';
import { AISummaryPanel } from './components/AISummaryPanel';
import { LoginModal } from './components/LoginModal';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSidebar } from './components/MobileSidebar';
import { MobileAIPanel } from './components/MobileAIPanel';
import { HomePage } from './components/HomePage';
import { LandingPage } from './components/LandingPage';
import { CalendarView } from './components/CalendarView';
import { FriendPage } from './components/FriendPage';
import { MyPage } from './components/MyPage';
import { supabase } from '../../utils/supabase/client';

type View = 'home' | 'chat' | 'calendar' | 'friend' | 'mypage';
const APP_STATE_KEY = 'dayserver-app-state';

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>(() => {
    try {
      const raw = localStorage.getItem(APP_STATE_KEY);
      if (!raw) return 'home';
      const parsed = JSON.parse(raw);
      return parsed.currentView || 'home';
    } catch {
      return 'home';
    }
  });
  const [selectedServer, setSelectedServer] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(APP_STATE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.selectedServer ?? null;
    } catch {
      return null;
    }
  });
  const [mobileTab, setMobileTab] = useState('home');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileAI, setShowMobileAI] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        APP_STATE_KEY,
        JSON.stringify({
          currentView,
          selectedServer,
        }),
      );
    } catch {
      // ignore
    }
  }, [currentView, selectedServer]);

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleServerClick = (serverId: string) => {
    setSelectedServer(serverId);
    setCurrentView('chat');
    setMobileTab('chat');
  };

  const handleFriendClick = (friendId: string) => {
    setSelectedFriendId(friendId);
    setCurrentView('friend');
    setMobileTab('friend');
  };

  const handleMyPageClick = () => {
    setCurrentView('mypage');
    setMobileTab('profile');
  };

  const handleMobileTabChange = (tab: string) => {
    setMobileTab(tab);
    if (tab === 'home') {
      setCurrentView('home');
    } else if (tab === 'profile') {
      setCurrentView('mypage');
    } else if (tab === 'calendar') {
      setCurrentView('calendar');
    } else if (tab === 'ai') {
      setShowMobileAI(true);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="size-full flex bg-gray-50 relative">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        <Sidebar
          onOpenModal={() => setShowLoginModal(true)}
          onServerClick={handleServerClick}
          onHomeClick={() => setCurrentView('home')}
          onCalendarClick={() => setCurrentView('calendar')}
          onFriendClick={handleFriendClick}
          onMyPageClick={handleMyPageClick}
          user={user}
        />
        {currentView === 'home' && (
          <HomePage
            onServerClick={handleServerClick}
            onCreateServerClick={() => setShowLoginModal(true)}
          />
        )}
        {currentView === 'chat' && (
          <>
            <ChatTimeline serverId={selectedServer || '1'} user={user} />
            <AISummaryPanel />
          </>
        )}
        {currentView === 'calendar' && <CalendarView onServerClick={handleServerClick} />}
        {currentView === 'friend' && <FriendPage friendId={selectedFriendId || '1'} />}
        {currentView === 'mypage' && <MyPage userId={user?.id || 'guest'} user={user} isOwner={true} />}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full flex flex-col">
        {currentView === 'chat' && (
          <MobileHeader
            channelName="오늘의 기록"
            onMenuClick={() => setShowMobileSidebar(true)}
          />
        )}

        <div className="flex-1 overflow-hidden">
          {currentView === 'home' && (
            <HomePage
              onServerClick={handleServerClick}
              onCreateServerClick={() => setShowLoginModal(true)}
            />
          )}
          {currentView === 'chat' && (
            <ChatTimeline
              serverId={selectedServer || '1'}
              onAISummaryClick={() => setShowMobileAI(true)}
              user={user}
            />
          )}
          {currentView === 'calendar' && <CalendarView onServerClick={handleServerClick} />}
          {currentView === 'friend' && <FriendPage friendId={selectedFriendId || '1'} />}
          {currentView === 'mypage' && <MyPage userId={user?.id || 'guest'} user={user} isOwner={true} />}
        </div>

        <MobileBottomNav
          activeTab={mobileTab}
          onTabChange={handleMobileTabChange}
          onMenuClick={() => setShowMobileSidebar(true)}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        onOpenModal={() => setShowLoginModal(true)}
        onServerClick={(serverId) => {
          handleServerClick(serverId);
          setShowMobileSidebar(false);
        }}
        onHomeClick={() => {
          setCurrentView('home');
          setMobileTab('home');
        }}
        onCalendarClick={() => {
          setCurrentView('calendar');
          setMobileTab('calendar');
        }}
        onFriendClick={handleFriendClick}
      />

      {/* Mobile AI Panel */}
      <MobileAIPanel
        isOpen={showMobileAI}
        onClose={() => setShowMobileAI(false)}
      />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
