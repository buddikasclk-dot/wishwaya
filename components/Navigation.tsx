import React, { useRef, useState, useEffect } from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  const services = [
    { id: 'dashboard', label: 'පලාපල', sub: 'මුල් පිටුව', icon: '🏠' },
    { id: 'matching', label: 'පොරොන්දම්', sub: 'ගැලපීම', icon: '💑' },
    { id: 'nekath', label: 'නැකත්', sub: 'සුබ වේලා', icon: '🗓️' },
    { id: 'palm', label: 'අත්ල', sub: 'අත්ල', icon: '✋' },
    { id: 'dreams', label: 'සිහින', sub: 'සිහින', icon: '🌙' },
    { id: 'vastu', label: 'වාස්තු', sub: 'වාස්තු', icon: '🧭' },
    { id: 'baby-naming', label: 'නම් තැබීම', sub: 'දරු නම්', icon: '👶' },
    { id: 'omens', label: 'නෙමිති', sub: 'නෙමිති', icon: '🧿' },
    { id: 'gems', label: 'මැණික්', sub: 'මැණික්', icon: '💎' },
    { id: 'rahu', label: 'රාහු කාලය', sub: 'රාහු', icon: '⌛' },
    { id: 'remedies', label: 'වතපිළිවෙත්', sub: 'වතපිළිවෙත්', icon: '🪔' },
    { id: 'loa', label: 'විශ්ව ආකර්ෂණ', sub: 'ආකර්ෂණය', icon: '🌌' },
    { id: 'pastlife', label: 'ආත්මීය මඟ', sub: 'ආත්ම මඟ', icon: '🌀' },
    { id: 'avurudu', label: 'අවුරුදු', sub: 'අවුරුදු', icon: '☀️' },
  ];

  const profileTab = { id: 'profile', label: 'ගිණුම', sub: 'ගිණුම', icon: '👤' };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center h-20 px-2 pb-2 zen-shadow z-50 max-w-md mx-auto">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[75px] transition-all duration-300 ${
              activeTab === tab.id ? 'text-green-600 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span className="text-[10px] font-bold sinhala leading-tight">{tab.label}</span>
            <span className="text-[8px] opacity-60 font-medium">{tab.sub}</span>
          </button>
        ))}

        {showArrow && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none pr-1 text-gray-300 animate-pulse">
            <span className="text-sm">→</span>
          </div>
        )}
      </div>

      <div className="flex-none border-l border-gray-100 pl-2 ml-2">
        <button
          onClick={() => setActiveTab(profileTab.id)}
          className={`flex flex-col items-center justify-center min-w-[70px] transition-all duration-300 ${
            activeTab === profileTab.id ? 'text-green-600 scale-105' : 'text-gray-400'
          }`}
        >
          <span className="text-xl mb-0.5">{profileTab.icon}</span>
          <span className="text-[10px] font-bold sinhala leading-tight">{profileTab.label}</span>
          <span className="text-[8px] opacity-60 font-medium">{profileTab.sub}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
