import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, LOAChallenge, LOACategoryId } from '../types';
import { WishwayaLocalDB } from '../utils/WishwayaLocalDB';
import { LOA_CONTENT } from '../data/loaContent';
import LOAHome from './LOA/LOAHome';
import LOAChallengeOverview from './LOA/LOAChallengeOverview';
import LOADailyPage from './LOA/LOADailyPage';
import LOACompletionPage from './LOA/LOACompletionPage';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface LawOfAttractionProps {
  profile: UserProfile;
}

const LawOfAttraction: React.FC<LawOfAttractionProps> = ({ profile }) => {
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [challenge, setChallenge] = useState<LOAChallenge | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'overview' | 'daily' | 'completion'>('home');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  // Generate stable user key - using a more robust method that handles Unicode (Sinhala) characters
  const userKey = React.useMemo(() => {
    const raw = `${profile.name}|${profile.dob}|${profile.city}`;
    // Use a simple hash or hex conversion for the key instead of btoa which fails on Unicode
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).slice(0, 16);
  }, [profile.name, profile.dob, profile.city]);

  const getNextUnlockTime = (lastCompletedDateISO: string) => {
    const lastCompleted = new Date(lastCompletedDateISO);
    const nextUnlockTime = new Date(lastCompleted);
    nextUnlockTime.setDate(nextUnlockTime.getDate() + 1);
    nextUnlockTime.setHours(5, 0, 0, 0);
    return nextUnlockTime;
  };

  const checkUnlockStatus = (chal: LOAChallenge): LOAChallenge => {
    if (!chal.startDateISO) return chal;
    
    const completedCount = chal.completedDays.length;
    
    // Day 1 is always unlocked if nothing is completed
    if (completedCount === 0) {
      return { ...chal, unlockedDay: 1 };
    }

    // If all 21 days are completed
    if (completedCount >= 21) {
      return { ...chal, unlockedDay: 21, challengeActive: false };
    }

    const nextDayToUnlock = Math.min(21, completedCount + 1);
    
    if (!chal.lastCompletedDateISO) {
      return { ...chal, unlockedDay: 1 };
    }

    const now = new Date();
    const nextUnlockTime = getNextUnlockTime(chal.lastCompletedDateISO);
    
    if (now >= nextUnlockTime) {
      return { ...chal, unlockedDay: nextDayToUnlock };
    } else {
      // Still within the 24-hour window of the last completion
      // The unlocked day is the last one they completed (so they can still view it, but not the next one)
      return { ...chal, unlockedDay: completedCount }; 
    }
  };

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setShowLoading(true);
    try {
      const data = await WishwayaLocalDB.getChallenge(userKey);
      if (data && data.challengeActive && data.goal) {
        // Check unlock status
        const updatedChallenge = checkUnlockStatus(data);
        setChallenge(updatedChallenge);
        
        if (updatedChallenge.completedDays.length >= 21) {
          setCurrentView('completion');
        } else {
          setCurrentView('overview');
        }
        
        const savedTasks = localStorage.getItem(`loa_tasks_${userKey}`);
        if (savedTasks) {
          setTaskStates(JSON.parse(savedTasks));
        }
      } else {
        setCurrentView('home');
      }
    } catch (e) {
      console.error("Failed to load LOA data", e);
      setCurrentView('home');
    } finally {
      setLoading(false);
    }
  }, [userKey]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handleSelectCategory = async (categoryId: LOACategoryId) => {
    const newChallenge: LOAChallenge = {
      userKey,
      challengeActive: true,
      goal: categoryId,
      startDateISO: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      completedDays: [],
      streakCount: 0,
      lastCompletedDateISO: null,
      unlockedDay: 1,
      badgeUnlocked: false,
      badgeName: null,
      musicEnabled: true
    };

    await WishwayaLocalDB.saveChallenge(newChallenge);
    setChallenge(newChallenge);
    setTaskStates({}); // Reset tasks
    localStorage.removeItem(`loa_tasks_${userKey}`);
    setCurrentView('overview');
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setCurrentView('daily');
  };

  const handleToggleTask = (taskId: string) => {
    const newStates = { ...taskStates, [taskId]: !taskStates[taskId] };
    setTaskStates(newStates);
    localStorage.setItem(`loa_tasks_${userKey}`, JSON.stringify(newStates));
  };

  const handleCompleteDay = async () => {
    if (!challenge || !selectedDay) return;

    const newCompletedDays = [...challenge.completedDays, selectedDay];
    const isFinalDay = selectedDay === 21;
    
    const updatedChallenge: LOAChallenge = {
      ...challenge,
      completedDays: newCompletedDays,
      lastCompletedDateISO: new Date().toISOString(),
      streakCount: challenge.streakCount + 1,
    };

    if (isFinalDay) {
      updatedChallenge.badgeUnlocked = true;
      updatedChallenge.badgeName = `${LOA_CONTENT[challenge.goal!].titleSinhala} - ජයග්‍රාහකයා`;
    }

    // Re-check unlock status immediately to ensure next day is locked until 5 AM
    const finalChallenge = checkUnlockStatus(updatedChallenge);

    await WishwayaLocalDB.saveChallenge(finalChallenge);
    setChallenge(finalChallenge);
    
    if (isFinalDay) {
      setCurrentView('completion');
    } else {
      setCurrentView('overview');
    }
  };

  const handleRestart = async () => {
    if (!challenge) return;
    const resetChallenge: LOAChallenge = {
      ...challenge,
      challengeActive: false,
      completedDays: [],
      streakCount: 0,
      lastCompletedDateISO: null,
      unlockedDay: 1,
      badgeUnlocked: false
    };
    await WishwayaLocalDB.saveChallenge(resetChallenge);
    setChallenge(null);
    setTaskStates({});
    localStorage.removeItem(`loa_tasks_${userKey}`);
    setCurrentView('home');
  };

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={!loading} 
        onComplete={() => setShowLoading(false)}
        icon="✨"
        title="දත්ත පූරණය වෙමින් පවතී..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="indigo"
        messages={[
          "විශ්ව ශක්තිය ග්‍රහණය කරමින් පවතී...",
          "ඔබගේ අරමුණු විශ්ලේෂණය කරමින් පවතී...",
          "දෛනික අභ්‍යාස සකස් කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  // Render Logic
  if (currentView === 'home' || !challenge) {
    return <LOAHome onSelectCategory={handleSelectCategory} />;
  }

  const categoryContent = LOA_CONTENT[challenge.goal!];

  if (currentView === 'completion') {
    return (
      <LOACompletionPage 
        category={categoryContent} 
        onRestart={handleRestart} 
        onHome={() => setCurrentView('home')} 
      />
    );
  }

  if (currentView === 'daily' && selectedDay) {
    const dayContent = categoryContent.days.find(d => d.dayNumber === selectedDay);
    if (dayContent) {
      return (
        <LOADailyPage
          dayContent={dayContent}
          category={categoryContent}
          taskStates={taskStates}
          onToggleTask={handleToggleTask}
          onCompleteDay={handleCompleteDay}
          onBack={() => setCurrentView('overview')}
        />
      );
    }
  }

  // Default to Overview
  return (
    <LOAChallengeOverview
      category={categoryContent}
      completedDays={challenge.completedDays}
      unlockedDay={challenge.unlockedDay}
      onSelectDay={handleSelectDay}
      onRestart={handleRestart}
    />
  );
};

export default LawOfAttraction;
