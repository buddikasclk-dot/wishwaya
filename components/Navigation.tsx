import React, { useEffect, useRef, useState } from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  const services = [
    { id: 'dashboard', label: 'ප්‍රධාන', sub: 'Home', icon: '🏠' },
    { id: 'matching', label: 'පොරොන්දම්', sub: 'Match', icon: '💑' },
    { id: 'nekath', label: 'නැකත්', sub: 'Nekath', icon: '🗓️' },
    { id: 'palm', label: 'අත්ල', sub: 'Palm', icon: '✋' },
    { id: 'dreams', label: 'සිහින', sub: 'Dreams', icon: '🌙' },
    { id: 'vastu', label: 'වාස්තු', sub: 'Vastu', icon: '🧭' },
    { id: 'baby-naming', label: 'නම්', sub: 'Baby', icon: '👶' },
    { id: 'omens', label: 'නෙමිති', sub: 'Omens', icon: '🧿' },
    { id: 'gems', label: 'මැණික්', sub: 'Stones', icon: '💎' },
    { id: 'rahu', label: 'රාහු', sub: 'Rahu', icon: '⌛' },
    { id: 'remedies', label: 'පිළියම්', sub: 'Remedies', icon: '🪔' },
    { id: 'loa', label: 'ආකර්ෂණ', sub: 'LOA', icon: '🌌' },
    { id: 'pastlife', label: 'Soul Path', sub: 'Soul', icon: '🌌' },
    { id: 'avurudu', label: 'අවුරුදු', sub: 'Avurudu', icon: '☀️' },
    { id: 'consultant', label: 'ජ්‍යොතිෂ', sub: 'Astrology', icon: '✨' },
  ];

  const profileTab = { id: 'profile', label: 'ගිණුම', sub: 'Profile', icon: '👤' };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-20 max-w-md items-center border-t border-gray-100 bg-white/95 px-2 pb-2 backdrop-blur-md zen-shadow">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="relative flex flex-1 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex min-w-[75px] flex-col items-center justify-center transition-all duration-300 ${
              activeTab === tab.id ? 'scale-105 text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="mb-0.5 text-xl">{tab.icon}</span>
            <span className="sinhala text-[10px] font-bold leading-tight">{tab.label}</span>
            <span className="text-[8px] font-medium opacity-60">{tab.sub}</span>
          </button>
        ))}

        {showArrow && (
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 animate-pulse pr-1 text-gray-300">
            <span className="text-sm">→</span>
          </div>
        )}
      </div>

      <div className="ml-2 flex-none border-l border-gray-100 pl-2">
        <button
          type="button"
          onClick={() => setActiveTab(profileTab.id)}
          className={`flex min-w-[70px] flex-col items-center justify-center transition-all duration-300 ${
            activeTab === profileTab.id ? 'scale-105 text-green-600' : 'text-gray-400'
          }`}
        >
          <span className="mb-0.5 text-xl">{profileTab.icon}</span>
          <span className="sinhala text-[10px] font-bold leading-tight">{profileTab.label}</span>
          <span className="text-[8px] font-medium opacity-60">{profileTab.sub}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
