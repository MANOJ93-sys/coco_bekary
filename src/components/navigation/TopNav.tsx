import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle, Menu, X } from 'lucide-react';
import { sound } from '../../services/soundEngine';

export type NavTab = 'home' | 'story' | 'chaos' | 'mood' | 'fake' | 'guestbook';

interface TopNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isChaosMode: boolean;
  onToggleChaos: () => void;
  onOpenChat: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  isChaosMode,
  onToggleChaos,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: 'story', label: 'Origin Story' },
    { id: 'chaos', label: 'Cake Chaos' },
    { id: 'mood', label: 'Mood Cake' },
    { id: 'fake', label: 'Cake or Fake?' },
    { id: 'guestbook', label: 'Guestbook' },
  ];

  const handleNavClick = (tab: NavTab) => {
    sound.playPop();
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#F2E5D3] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-xl md:text-2xl font-black tracking-tight text-[#3D2314] hover:text-[#D81159] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#D81159]"
        >
          <span className="text-[#E63946]">Coco Crumble</span>
          <span className="text-lg">🍓</span>
        </button>

        {/* Zone 2: 4-5 Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#664635]"
          aria-label="Bakery sections"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                  isActive
                    ? 'border-[#D81159] text-[#D81159]'
                    : 'border-transparent hover:text-[#3D2314] hover:border-[#F2C5CE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Atmosphere Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-xl transition-all border ${
              isMuted
                ? 'bg-[#F5EFEB] text-[#8C7A70] border-[#E2D5C7]'
                : 'bg-[#FFE4E9] text-[#D81159] border-[#FFCCD5] shadow-xs'
            }`}
            title={isMuted ? 'Unmute bakery sound effects' : 'Mute bakery sound effects'}
            aria-label={isMuted ? 'Sound muted, tap to unmute' : 'Sound active, tap to mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Chaos Mode Toggle */}
          <button
            onClick={() => {
              sound.playSprinkles();
              onToggleChaos();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              isChaosMode
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm animate-pulse'
                : 'bg-[#FAF0E6] text-[#664635] border-[#E5D7BE] hover:bg-[#FFEBE5]'
            }`}
            title="Toggle high-energy sprinkle Chaos Mode"
          >
            <Sparkles size={14} className={isChaosMode ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Chaos Mode</span>
            <span className="sm:hidden">Chaos</span>
          </button>

          {/* Chat with Coco */}
          <button
            onClick={() => {
              sound.playChime();
              onOpenChat();
            }}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#D81159] text-white hover:bg-[#C00E4E] transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageCircle size={14} />
            <span className="hidden sm:inline">Ask Coco</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-[#3D2314] rounded-lg hover:bg-[#FAF0E6]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden mt-3 pt-3 border-t border-[#F2E5D3] flex flex-col gap-2 pb-2 text-sm font-semibold"
          aria-label="Mobile bakery sections"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[#FFE4E9] text-[#D81159]'
                  : 'text-[#664635] hover:bg-[#FAF0E6]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
