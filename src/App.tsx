import React, { useState, useEffect } from 'react';
import { TopNav, NavTab } from './components/navigation/TopNav';
import { LandingHero } from './components/views/LandingHero';
import { OriginStory } from './components/views/OriginStory';
import { CakeChaosGame } from './components/views/CakeChaosGame';
import { MoodCakeFinder } from './components/views/MoodCakeFinder';
import { CakeOrFakeGame } from './components/views/CakeOrFakeGame';
import { GuestbookView } from './components/views/GuestbookView';
import { CocoChatPanel } from './components/chat/CocoChatPanel';
import { SparkleCursor } from './components/mascot/SparkleCursor';
import { sound } from './services/soundEngine';
import { Sparkles, Crown, X, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [isChaosMode, setIsChaosMode] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Easter Egg State
  const [clipClickCount, setClipClickCount] = useState<number>(0);
  const [isGoldenMode, setIsGoldenMode] = useState<boolean>(false);
  const [showEasterEggModal, setShowEasterEggModal] = useState<boolean>(false);

  // Visitor Counter
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('coco_crumbles_visits');
    if (saved) {
      return parseInt(saved, 10);
    }
    const initial = 1429;
    localStorage.setItem('coco_crumbles_visits', initial.toString());
    return initial;
  });

  // Increment visitor counter once per browser session
  useEffect(() => {
    const sessionKey = 'coco_session_counted';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      setVisitorCount((prev) => {
        const next = prev + 1;
        localStorage.setItem('coco_crumbles_visits', next.toString());
        return next;
      });
    }
  }, []);

  // Keyboard shortcut secret trigger ("frosting")
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) {
        keyBuffer = keyBuffer.slice(-10);
      }
      if (keyBuffer.endsWith('frosting')) {
        triggerEasterEgg();
        keyBuffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerEasterEgg = () => {
    sound.playVictory();
    setIsGoldenMode(true);
    setShowEasterEggModal(true);
  };

  const handleClipClick = () => {
    const nextCount = clipClickCount + 1;
    setClipClickCount(nextCount);
    if (nextCount >= 5 && !isGoldenMode) {
      triggerEasterEgg();
    }
  };

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const toggleChaos = () => {
    setIsChaosMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
        isChaosMode ? 'bg-[#FFF0F5] animate-chaos' : 'bg-[#FFFDF7]'
      }`}
    >
      {/* Lightweight Pointer Sparkles */}
      <SparkleCursor />

      {/* Floating Chaos Mode Confetti Sprinkles if active */}
      {isChaosMode && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
          <div className="absolute top-10 left-10 text-4xl animate-bounce">✨</div>
          <div className="absolute top-24 right-14 text-3xl animate-bounce [animation-delay:0.3s]">🍓</div>
          <div className="absolute bottom-20 left-20 text-4xl animate-bounce [animation-delay:0.6s]">🧁</div>
          <div className="absolute bottom-32 right-24 text-3xl animate-bounce [animation-delay:0.9s]">⭐</div>
        </div>
      )}

      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isChaosMode={isChaosMode}
        onToggleChaos={toggleChaos}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 md:pt-10">
        {activeTab === 'home' && (
          <LandingHero
            onNavigate={setActiveTab}
            visitorCount={visitorCount}
            onClipClick={handleClipClick}
            isGoldenMode={isGoldenMode}
          />
        )}

        {activeTab === 'story' && (
          <OriginStory
            onEnterBakery={() => {
              sound.playVictory();
              setActiveTab('home');
            }}
            onNavigateToActivity={setActiveTab}
          />
        )}

        {activeTab === 'chaos' && <CakeChaosGame />}

        {activeTab === 'mood' && <MoodCakeFinder />}

        {activeTab === 'fake' && <CakeOrFakeGame />}

        {activeTab === 'guestbook' && <GuestbookView visitorCount={visitorCount} />}
      </main>

      {/* Floating Chat Panel with Coco */}
      <CocoChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Secret Easter Egg Celebration Modal */}
      {showEasterEggModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-400 shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setShowEasterEggModal(false)}
              className="absolute top-4 right-4 text-[#8C7A70] hover:text-[#3D2314] p-1.5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              <Crown size={36} className="text-amber-500 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Hidden Bakery Secret Discovered!
              </span>
              <h3 className="text-2xl font-black text-[#3D2314] mt-1">
                The Golden Baker Crown!
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#664635] leading-relaxed">
              You uncovered Coco&#39;s strawberry clip secret! Grandma Hazel’s legendary Golden
              Chef Hat has been unlocked. Coco will now wear her golden toque across the bakery!
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowEasterEggModal(false)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-md transition-all"
              >
                Wear the Golden Crown! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Storybook Footer */}
      <footer className="border-t border-[#F2E5D3] bg-[#FAF6EE] py-6 px-4 text-center text-xs text-[#8C7A70] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[#664635]">
            <span>Coco Crumble</span>
            <span>·</span>
            <span className="italic">&ldquo;Life is short. Add extra frosting!&rdquo;</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('story');
              }}
              className="hover:text-[#D81159] transition-colors"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('guestbook');
              }}
              className="hover:text-[#D81159] transition-colors"
            >
              Guestbook
            </button>
            <span className="text-[11px] opacity-70">Sugarberry Lane Confectionery</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
