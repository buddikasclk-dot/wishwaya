import React, { useState, useEffect } from 'react';

const SINHALA_DAYS = [
  'ඉරිදා', // Sunday
  'සඳුදා', // Monday
  'අඟහරුවාදා', // Tuesday
  'බදාදා', // Wednesday
  'බ්‍රහස්පතින්දා', // Thursday
  'සිකුරාදා', // Friday
  'සෙනසුරාදා' // Saturday
];

// Rahu Kalaya Map (Daytime, assuming 6:00 AM sunrise)
const RAHU_MAP_DAY = [
  { start: '16:30', end: '18:00' }, // Sun
  { start: '07:30', end: '09:00' }, // Mon
  { start: '15:00', end: '16:30' }, // Tue
  { start: '12:00', end: '13:30' }, // Wed
  { start: '13:30', end: '15:00' }, // Thu
  { start: '10:30', end: '12:00' }, // Fri
  { start: '09:00', end: '10:30' }, // Sat
];

// Rahu Kalaya Map (Nighttime, assuming 6:00 PM sunset)
const RAHU_MAP_NIGHT = [
  { start: '04:30', end: '06:00' }, // Sun night -> Mon morning
  { start: '19:30', end: '21:00' }, // Mon
  { start: '03:00', end: '04:30' }, // Tue night -> Wed morning
  { start: '00:00', end: '01:30' }, // Wed
  { start: '01:30', end: '03:00' }, // Thu
  { start: '22:30', end: '00:00' }, // Fri
  { start: '21:00', end: '22:30' }, // Sat
];

const RahuKalaya: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [view, setView] = useState<'day' | 'night'>('day');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayIndex = now.getDay();
  const rahuDay = RAHU_MAP_DAY[dayIndex];
  const rahuNight = RAHU_MAP_NIGHT[dayIndex];

  const checkStatus = (start: string, end: string) => {
    const current = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    if (current >= startTime && current < endTime) return 'active';
    if (current < startTime) return 'upcoming';
    return 'passed';
  };

  const dayStatus = checkStatus(rahuDay.start, rahuDay.end);
  const nightStatus = checkStatus(rahuNight.start, rahuNight.end);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'ප.ව.' : 'පෙ.ව.';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Generate weekly list starting from Sunday
  const weeklySchedule = SINHALA_DAYS.map((day, index) => ({
    day,
    index,
    daytime: RAHU_MAP_DAY[index],
    nighttime: RAHU_MAP_NIGHT[index]
  }));

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-2 pt-4">
        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 zen-shadow border border-amber-100">
          <span className="text-4xl">⌛</span>
        </div>
        <h2 className="text-3xl font-black sinhala text-gray-800">රාහු කාලය</h2>
        <p className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em]">{SINHALA_DAYS[dayIndex]} පලාපල</p>
      </header>

      <div className="flex p-1.5 bg-gray-100 rounded-[2rem] max-w-[280px] mx-auto">
        <button 
          onClick={() => setView('day')}
          className={`flex-1 py-3 rounded-[1.5rem] sinhala font-bold text-xs transition-all ${view === 'day' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'}`}
        >
          දිවා කාලය
        </button>
        <button 
          onClick={() => setView('night')}
          className={`flex-1 py-3 rounded-[1.5rem] sinhala font-bold text-xs transition-all ${view === 'night' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'}`}
        >
          රාත්‍රී කාලය
        </button>
      </div>

      <div className="bg-white p-8 rounded-[3.5rem] zen-shadow border border-white relative overflow-hidden text-center">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-40" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest sinhala">අද දවසේ රාහු කාලය</span>
            <div className="flex flex-col items-center">
              <p className="sinhala font-black text-4xl text-gray-800 tracking-tight">
                {view === 'day' ? `${formatTime(rahuDay.start)} - ${formatTime(rahuDay.end)}` : `${formatTime(rahuNight.start)} - ${formatTime(rahuNight.end)}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {(view === 'day' ? dayStatus : nightStatus) === 'active' ? (
              <div className="px-6 py-2 bg-rose-50 border border-rose-100 rounded-full flex items-center space-x-3 animate-pulse">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                <span className="sinhala text-rose-600 font-black text-xs uppercase tracking-wider">දැන් ක්‍රියාත්මකයි (Active Now)</span>
              </div>
            ) : (view === 'day' ? dayStatus : nightStatus) === 'upcoming' ? (
              <div className="px-6 py-2 bg-amber-50 border border-amber-100 rounded-full flex items-center space-x-3">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                <span className="sinhala text-amber-600 font-black text-xs uppercase tracking-wider">මීළඟ රාහු කාලය (Upcoming)</span>
              </div>
            ) : (
              <div className="px-6 py-2 bg-gray-50 border border-gray-100 rounded-full flex items-center space-x-3">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="sinhala text-gray-400 font-black text-xs uppercase tracking-wider">අද දිනට අවසන් (Passed)</span>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-50 w-full" />

          <p className="sinhala text-xs text-gray-500 leading-relaxed font-medium px-4">
            රාහු කාලය තුළ නව කටයුතු ආරම්භ කිරීම, ගමන් බිමන් යාම හෝ වැදගත් තීරණ ගැනීමෙන් වැළකී සිටීම සුබදායක බව සාම්ප්‍රදායික ජ්‍යෝතිෂ්‍ය මතයයි.
          </p>
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black sinhala text-gray-800 tracking-tight">සතිපතා කාලසටහන</h3>
          <span className="text-[9px] text-amber-600 font-black uppercase tracking-[0.2em] bg-amber-50 px-3 py-1 rounded-full">Weekly Schedule</span>
        </div>

        <div className="bg-white p-4 rounded-[2.5rem] zen-shadow border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {weeklySchedule.map((item) => {
              const isToday = item.index === dayIndex;
              const schedule = view === 'day' ? item.daytime : item.nighttime;
              
              return (
                <div 
                  key={item.index} 
                  className={`flex items-center justify-between py-5 px-4 transition-all ${isToday ? 'bg-amber-50/50 rounded-[1.5rem] border border-amber-100/30' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className={`sinhala font-black text-sm ${isToday ? 'text-amber-700' : 'text-gray-700'}`}>
                      {item.day} {isToday && <span className="text-[10px] ml-1 opacity-50">(අද)</span>}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`sinhala font-bold text-sm ${isToday ? 'text-amber-800' : 'text-gray-500'}`}>
                      {formatTime(schedule.start)} - {formatTime(schedule.end)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bg-amber-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-6xl opacity-10">🌙</div>
        <div className="space-y-4 relative z-10">
          <h4 className="sinhala font-black text-lg tracking-tight">අද විශේෂ අවධානයට</h4>
          <p className="sinhala text-sm text-amber-100 leading-relaxed opacity-90">
            අද {SINHALA_DAYS[dayIndex]} දිනය වන අතර, විශේෂයෙන් {view === 'day' ? formatTime(rahuDay.start) : formatTime(rahuNight.start)} සිට {view === 'day' ? formatTime(rahuDay.end) : formatTime(rahuNight.end)} දක්වා කාලය තුළ අධ්‍යාත්මික කටයුතු වල නිරත වීම වඩාත් යෝග්‍ය වේ.
          </p>
        </div>
      </div>

      <div className="text-center opacity-30">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">Ancient Knowledge • Modern Insight</p>
      </div>
    </div>
  );
};

export default RahuKalaya;