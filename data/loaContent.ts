import { LOACategoryContent } from '../types';

var isInitializingLOAContent = true;

export const LOA_CONTENT: Record<string, LOACategoryContent> = {
  wealth: {
    id: 'wealth',
    titleSinhala: 'ධනය හා සෞභාග්‍යය',
    titleEnglish: 'Wealth & Abundance',
    icon: '💰',
    introDescription: 'ධනය ආකර්ෂණය කර ගැනීම යනු ඔබේ මනස, හදවත සහ ක්‍රියාවන් සෞභාග්‍යය සඳහා සූදානම් කිරීමයි. මෙම දින 21 තුළ අපි ඔබේ මනස හිඟකමෙන් මුදවා, ධනවත් භාවය වෙත යොමු කරමු.',
    spiritualPhrase: 'විශ්වයේ අසීමිත සම්පත් මා වෙත ගලා ඒමට මම ඉඩ දෙමි.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getWealthDayTitle(i + 1)}`,
      miniDescription: getWealthDayDesc(i + 1),
      affirmation: getWealthAffirmation(i + 1),
      tasks: getWealthTasks(i + 1)
    }))
  },
  health: {
    id: 'health',
    titleSinhala: 'නිරෝගී සුවය',
    titleEnglish: 'Health & Wellness',
    icon: '🧘',
    introDescription: 'සැබෑ සුවය ආරම්භ වන්නේ අභ්‍යන්තරයෙනි. ඔබේ සිතුවිලි, හැඟීම් සහ පුරුදු සුවපත් වූ විට, ඔබේ ශරීරයද එයට ප්‍රතිචාර දක්වයි.',
    spiritualPhrase: 'මගේ ශරීරය ස්වභාවධර්මයේ ආශිර්වාදයකි. මම එයට ගරු කරමි.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getHealthDayTitle(i + 1)}`,
      miniDescription: getHealthDayDesc(i + 1),
      affirmation: getHealthAffirmation(i + 1),
      tasks: getHealthTasks(i + 1)
    }))
  },
  love: {
    id: 'love',
    titleSinhala: 'ආදරය හා සබඳතා',
    titleEnglish: 'Love & Relationships',
    icon: '❤️',
    introDescription: 'ආදරය ලැබීමට නම්, ඔබ ආදරය පිරුණු කෙනෙකු විය යුතුය. මෙම ගමන ඔබේ හදවත විවෘත කර, යහපත් සබඳතා ආකර්ෂණය කර ගැනීමට උපකාරී වේ.',
    spiritualPhrase: 'මම ආදරය ලැබීමට සුදුසුයි. මම ආදරය බෙදා දීමට සූදානම්.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getLoveDayTitle(i + 1)}`,
      miniDescription: getLoveDayDesc(i + 1),
      affirmation: getLoveAffirmation(i + 1),
      tasks: getLoveTasks(i + 1)
    }))
  },
  career: {
    id: 'career',
    titleSinhala: 'රැකියාව හා දියුණුව',
    titleEnglish: 'Career & Success',
    icon: '💼',
    introDescription: 'සාර්ථකත්වය යනු පැහැදිලි අරමුණක් සහ කැපවීමයි. ඔබේ වෘත්තීය ජීවිතය ඉහළට ඔසවා තැබීමට අවශ්‍ය මානසිකත්වය මෙහිදී ගොඩනඟමු.',
    spiritualPhrase: 'මගේ දක්ෂතාවලට ලෝකයේ වටිනාකමක් ඇත. මම සාර්ථකත්වය කරා පියනඟමි.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getCareerDayTitle(i + 1)}`,
      miniDescription: getCareerDayDesc(i + 1),
      affirmation: getCareerAffirmation(i + 1),
      tasks: getCareerTasks(i + 1)
    }))
  },
  education: {
    id: 'education',
    titleSinhala: 'අධ්‍යාපනය හා දැනුම',
    titleEnglish: 'Education & Wisdom',
    icon: '🎓',
    introDescription: 'දැනුම සොයා යන ගමනේදී ඒකාග්‍රතාවය සහ මතකය ඉතා වැදගත් වේ. ඔබේ මනස ඉගෙනීමට පහසු, සැහැල්ලු තැනක් බවට පත් කරගනිමු.',
    spiritualPhrase: 'මගේ මනස දැනුම උරා ගැනීමට සූදානම්. මම ඉගෙනීමට ප්‍රිය කරමි.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getEducationDayTitle(i + 1)}`,
      miniDescription: getEducationDayDesc(i + 1),
      affirmation: getEducationAffirmation(i + 1),
      tasks: getEducationTasks(i + 1)
    }))
  },
  peace: {
    id: 'peace',
    titleSinhala: 'මානසික සාමය',
    titleEnglish: 'Inner Peace',
    icon: '🕊️',
    introDescription: 'සාමය යනු බාහිර ලෝකයේ නිශ්ශබ්දතාවය නොව, අභ්‍යන්තරයේ සන්සුන්කමයි. ඔබේ සිතුවිලි පාලනය කර සැනසීම ළඟා කරගනිමු.',
    spiritualPhrase: 'සෑම මොහොතකම සන්සුන්ව සිටීමට මට ශක්තිය ඇත.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getPeaceDayTitle(i + 1)}`,
      miniDescription: getPeaceDayDesc(i + 1),
      affirmation: getPeaceAffirmation(i + 1),
      tasks: getPeaceTasks(i + 1)
    }))
  },
  spiritual: {
    id: 'spiritual',
    titleSinhala: 'ආධ්‍යාත්මික දියුණුව',
    titleEnglish: 'Spiritual Growth',
    icon: '🕉️',
    introDescription: 'අපගේ ජීවිතයේ ගැඹුරුම අරමුණ සොයා යාම ආධ්‍යාත්මික දියුණුවයි. විශ්වය සමඟ ඔබේ බැඳීම ශක්තිමත් කරගන්න.',
    spiritualPhrase: 'මම විශ්වයේ කොටසක්මි. විශ්වය මා තුළ ඇත.',
    days: Array.from({ length: 21 }, (_, i) => ({
      dayNumber: i + 1,
      title: `දින ${i + 1}: ${getSpiritualDayTitle(i + 1)}`,
      miniDescription: getSpiritualDayDesc(i + 1),
      affirmation: getSpiritualAffirmation(i + 1),
      tasks: getSpiritualTasks(i + 1)
    }))
  }
};

// --- Helper Functions for Content Generation ---

function getGenericTasksForDay(day: number): any[] {
  const tasksByDay: Record<number, { text: string, type: 'action' | 'gratitude' | 'vibration' | 'mindfulness' | 'journaling' }[]> = {
    1: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී වතුර වීදුරුවක් බොන්න." },
      { type: 'gratitude', text: "අද දින ඔබ ස්තූතිවන්ත වන කරුණු 3ක් ලියන්න." },
      { type: 'mindfulness', text: "විනාඩි 5ක් නිශ්ශබ්දව ඔබේ සිතුවිලි නිරීක්ෂණය කරන්න." }
    ],
    2: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී විනාඩි 5ක් ශරීරය ඇදගන්න (Stretching)." },
      { type: 'journaling', text: "අද දින ඔබ සාක්ෂාත් කර ගැනීමට බලාපොරොත්තු වන ප්‍රධාන අරමුණ තීරණය කරන්න." },
      { type: 'vibration', text: "කණ්ණාඩිය දෙස බලා 'මට ඕනෑම දෙයක් කළ හැකියි' යැයි පවසන්න." }
    ],
    3: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී වහාම ඔබේ ඇඳ සකස් කරන්න." },
      { type: 'action', text: "ඔබේ සේවා ස්ථානයේ හෝ නිවසේ එක් කුඩා කොටසක් පිරිසිදු කර පිළිවෙලකට තබන්න." },
      { type: 'mindfulness', text: "අද දවස පුරා කිසිදු දෙයක් ගැන මැසිවිලි නැගීමෙන් (Complaining) වළකින්න." }
    ],
    4: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී විනාඩි 5ක හුස්ම ගැනීමේ අභ්‍යාසයක් කරන්න." },
      { type: 'action', text: "අද ඔබට හමුවන අයෙකුට අවංකවම ප්‍රශංසා කරන්න." },
      { type: 'action', text: "ඔබේ අතීතයේ ඔබට උදව් කළ අයෙකුට 'ස්තූතියි' පණිවිඩයක් යවන්න." }
    ],
    5: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ප්‍රබෝධමත් පොතක පිටු 5ක් කියවන්න." },
      { type: 'vibration', text: "විනාඩි 10ක් ඔබේ සිහින ජීවිතය ඉතා පැහැදිලිව සිතින් මවාගන්න." },
      { type: 'journaling', text: "ඔබ තුළ ඇති එක් සෘණාත්මක සිතුවිල්ලක් හඳුනාගෙන එය ධනාත්මක එකකින් ආදේශ කරන්න." }
    ],
    6: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී සිසිල් ජලයෙන් ස්නානය කරන්න." },
      { type: 'action', text: "අද දින කළ යුතු අමාරුම කාර්යය මුලින්ම අවසන් කරන්න." },
      { type: 'action', text: "අවදි වී පළමු පැය 2 තුළ සමාජ මාධ්‍ය (Social Media) භාවිතයෙන් වළකින්න." }
    ],
    7: [
      { type: 'journaling', text: "උදෑසන 5:00 ට අවදි වී ඔබේ අනාගත ස්වයං (Future Self) වෙත ලිපියක් ලියන්න." },
      { type: 'journaling', text: "පසුගිය දින 6 තුළ ඔබේ ප්‍රගතිය සමාලෝචනය කරන්න." },
      { type: 'action', text: "විනාඩි 15ක් ස්වභාවධර්මය සමඟ හෝ උද්‍යානයක ඇවිදින්න." }
    ],
    8: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී අද දින නන්නාඳුනන අයෙකුට කළ හැකි කුඩා උදව්වක් සැලසුම් කරන්න." },
      { type: 'action', text: "කිසිදු ප්‍රතිලාභයක් බලාපොරොත්තු නොවී අද අයෙකුට උදව් කරන්න." },
      { type: 'mindfulness', text: "අද දින සෑම සංවාදයකදීම අනෙක් පාර්ශවයට හොඳින් සවන් දෙන්න (Active Listening)." }
    ],
    9: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබ ඉගෙන ගැනීමට කැමති අලුත් කුසලතාවයක් ගැන සොයා බලන්න." },
      { type: 'journaling', text: "ඔබේ සමාජයේ පවතින විසඳිය හැකි එක් ගැටලුවක් හඳුනාගන්න." },
      { type: 'journaling', text: "අමතර ආදායමක් (Side Hustle) ඉපැයිය හැකි ක්‍රම 3ක් ලියා තබන්න." }
    ],
    10: [
      { type: 'mindfulness', text: "උදෑසන 5:00 ට අවදි වී විනාඩි 10ක් භාවනා කරන්න." },
      { type: 'action', text: "කිසිදු බාධාවකින් තොරව විනාඩි 60ක් එක් විශේෂ කාර්යයක නිරත වන්න." },
      { type: 'journaling', text: "ඔබ සතු ශක්තීන් (Strengths) 5ක් ලැයිස්තුගත කරන්න." }
    ],
    11: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී සෞඛ්‍ය සම්පන්න උදෑසන ආහාරයක් පිළියෙල කරගන්න." },
      { type: 'action', text: "අද දවස පුරා අවම වශයෙන් වතුර ලීටර් 2ක් පානය කරන්න." },
      { type: 'action', text: "විනාඩි 20ක ශාරීරික ව්‍යායාමයක නිරත වන්න (ඇවිදීම, යෝග හෝ ජිම්)." }
    ],
    12: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ප්‍රබෝධමත් උද්ධෘතයක් (Quote) සමාජ මාධ්‍යවල බෙදාගන්න." },
      { type: 'action', text: "ඔබ තවදුරටත් භාවිත නොකරන වටිනා දෙයක් අවශ්‍ය අයෙකුට පරිත්‍යාග කරන්න." },
      { type: 'action', text: "මිතුරෙකුට හෝ සගයෙකුට ඔබේ දැනුමෙන් උදව් කරන්න." }
    ],
    13: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබ මගහරිමින් සිටි එක් කුඩා බියකට මුහුණ දෙන්න." },
      { type: 'action', text: "ඔබ සාමාන්‍යයෙන් නිහඬව සිටින රැස්වීමකදී හෝ සංවාදයකදී අදහස් දක්වන්න." },
      { type: 'action', text: "ඔබ ගරු කරන අයෙකුගෙන් ඔබේ වැඩ කටයුතු ගැන ප්‍රතිපෝෂණ (Feedback) විමසන්න." }
    ],
    14: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබේ උදෑසන චර්යාව (Morning Routine) නිවැරදිව අනුගමනය කරන්න." },
      { type: 'journaling', text: "ඔබේ දින 21 ඉලක්ක සමාලෝචනය කර අවශ්‍ය නම් වෙනස්කම් කරන්න." },
      { type: 'vibration', text: "'මම සෑම දිනකම මාගේ හොඳම අනුවාදය බවට පත්වෙමි' යැයි ස්ථිර කරන්න." }
    ],
    15: [
      { type: 'journaling', text: "උදෑසන 5:00 ට අවදි වී ඔබේ රැකියාවට වැඩි වටිනාකමක් එක් කළ හැකි ආකාරය ගැන සිතන්න." },
      { type: 'action', text: "ඔබේ ක්ෂේත්‍රයේ අත්දැකීම් ඇති අයෙකු සමඟ සම්බන්ධ වීමට උත්සාහ කරන්න." },
      { type: 'action', text: "මූල්‍ය කළමනාකරණය හෝ ආයෝජනය ගැන විනාඩි 30ක් ඉගෙන ගන්න." }
    ],
    16: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබ කල් දමමින් සිටි කාර්යයක් ආරම්භ කරන්න." },
      { type: 'journaling', text: "අද ඔබට බාධාවක් ඇති වුවහොත්, එයින් උගත් පාඩම් 3ක් ලියා තබන්න." },
      { type: 'vibration', text: "'අභියෝග යනු වර්ධනය සඳහා ලැබෙන අවස්ථාවන්' බව ඔබටම මතක් කරගන්න." }
    ],
    17: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබේ ක්ෂේත්‍රයේ අයෙකු සමඟ අලුතින් සම්බන්ධ වන්න." },
      { type: 'action', text: "ඔබේ අරමුණු ගැන ඔබට සහයෝගය දෙන මිතුරෙකු සමඟ සාකච්ඡා කරන්න." },
      { type: 'action', text: "ඔබේ ක්ෂේත්‍රයේ නව ප්‍රවණතා ගැන ලිපියක් කියවන්න හෝ වීඩියෝවක් බලන්න." }
    ],
    18: [
      { type: 'journaling', text: "උදෑසන 5:00 ට අවදි වී ඔබේ දෛනික පුරුදු ඇගයීමට ලක් කරන්න." },
      { type: 'action', text: "එක් අහිතකර පුරුද්දක් වෙනුවට යහපත් පුරුද්දක් ආරම්භ කරන්න." },
      { type: 'action', text: "වඩාත් කාර්යක්ෂම වීම සඳහා ඔබේ ඩිජිටල් ලිපිගොනු සහ ඊමේල් පිළිවෙලකට සකසන්න." }
    ],
    19: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබේ අමතර ආදායම් මාර්ගය (Side Hustle) වෙනුවෙන් එක් පියවරක් තබන්න." },
      { type: 'action', text: "ඔබේ අදහසක් හෝ සේවාවක් අයෙකුට ඉදිරිපත් කරන්න (Pitch)." },
      { type: 'action', text: "ඔබේ වර්තමාන උත්සාහයන් තවදුරටත් පුළුල් කළ හැකි ආකාරය ගැන සොයා බලන්න." }
    ],
    20: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබේ ප්‍රධාන කුසලතාවය (Core Skill) විනාඩි 90ක් පුහුණු වන්න." },
      { type: 'action', text: "ඔබ මෑතකදී ඉගෙන ගත් දෙයක් වෙනත් අයෙකුට උගන්වන්න." },
      { type: 'journaling', text: "පසුගිය දින 20 තුළ ඔබ ලබා ඇති දියුණුව ගැන ආපසු හැරී බලන්න." }
    ],
    21: [
      { type: 'action', text: "උදෑසන 5:00 ට අවදි වී ඔබේ දින 21 ගමන සැමරීමට යමක් කරන්න." },
      { type: 'journaling', text: "ඉදිරි දින 90 සඳහා ඔබේ නව ඉලක්ක සකස් කරගන්න." },
      { type: 'vibration', text: "මෙම යහපත් පුරුදු ජීවිත කාලය පුරාම පවත්වා ගැනීමට අධිෂ්ඨාන කරගන්න." }
    ]
  };

  const dayTasks = tasksByDay[day] || tasksByDay[1];
  return dayTasks.map((t, i) => ({
    id: `day${day}_task${i + 1}`,
    ...t
  }));
}

function buildSpecificTasks(
  day: number,
  tasksByDay: { text: string; type: 'action' | 'gratitude' | 'vibration' | 'mindfulness' | 'journaling' }[][]
): any[] {
  const dayTasks = tasksByDay[day - 1] || tasksByDay[0];
  return dayTasks.map((t, i) => ({
    id: `day${day}_task${i + 1}`,
    ...t
  }));
}

const WEALTH_TASKS = [
  [
    { type: 'vibration', text: 'විනාඩි 2ක් නිශ්ශබ්දව සිට ධනය ඔබේ ජීවිතයට පිළිගන්නා බව හදවතින් දැනගන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 සඳහා ඔබේ මුදල් අරමුණක් එක වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබේ මුදල් පසුම්බිය හෝ මුදල් තබන ස්ථානය විනාඩි 5ක් පිළිවෙලට සකසන්න.' }
  ],
  [
    { type: 'gratitude', text: 'අද ඔබ සතුව දැනටමත් ඇති සම්පත් හෝ පහසුකම් 3ක් ලියන්න.' },
    { type: 'vibration', text: '"මම සාමයෙන් මුදල් ලබාගෙන හොඳින් පාලනය කිරීමට සූදානම්" යැයි මෘදුව කියන්න.' },
    { type: 'action', text: 'මුදලට ගරු කිරීමේ සංකේතයක් ලෙස එක කාසියක් හෝ නෝට්ටුවක් පිළිවෙලට තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'මුදල් ගැන ඇති බියකින් පිරුණු එක සිතුවිල්ලක් හඳුනාගෙන හුස්ම ගෙන එය ලිහිල් කරන්න.' },
    { type: 'journaling', text: 'ඔබේ ජීවිතයේ මුදල් ගැන ඔබට දැනෙන්න ඕනේ ආකාරය ලියන්න: සාමය, ස්ථාවරත්වය, නිදහස හෝ ආරක්ෂාව.' },
    { type: 'action', text: 'බිල්, රිසිට් හෝ මුදල් අස්ථාවරතාව ඇති කුඩා තැනක් පිරිසිදු කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'කුඩා ආකාරයෙන් වුවත් මුදල් ඔබට උදව් කළ සියලුම ක්‍රම සඳහා ස්තූතිවන්ත වන්න.' },
    { type: 'vibration', text: 'ඔබේ අවශ්‍යතා පහසුවෙන් සපුරන අයුරු මනසින් දැක සිනහවක් තබාගන්න.' },
    { type: 'action', text: 'කාඩ්පත්, මුදල් හෝ ගෙවීම් යෙදුම් සරලව පිළිවෙලට සකසන්න.' }
  ],
  [
    { type: 'journaling', text: 'සමෘද්ධිය දැනටමත් ඔබේ දිනපතා ජීවිතයට දෙන සරල දේ 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 3ක් ගෙන ජීවිතය දැනටමත් ඔබට සහය දෙන තැන් සලකා බලන්න.' },
    { type: 'action', text: 'අද හැකි නම් අනවශ්‍ය වියදමක් එකක් මෘදුව මඟහරින්න.' }
  ],
  [
    { type: 'vibration', text: 'විනාඩි 5ක් ඔබේ සමාධානවත් සමෘද්ධිමත් දවසක් මනසින් දකින්න.' },
    { type: 'journaling', text: 'ඔබ වර්ධනය කරගැනීමට කැමති ආදායම හෝ ජීවන රටාව ගැන එක වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ කාමරයේ හෝ මේසයේ කුඩා කොනක් අලුත් කර සමෘද්ධිමත් හැඟීමක් ගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මේ දක්වා ඔබේ ජීවිතය රැකගැනීමට කළ සෑම උත්සාහයක් සඳහාම ඔබටම ස්තූති කරන්න.' },
    { type: 'vibration', text: '"මට මුදල් පැත්තෙන් වර්ධනය වීමට ප්‍රමාණවත් ඉඩ ඇත" යැයි නැවත කියන්න.' },
    { type: 'action', text: 'අද ඉතා කුඩා මුදලක් වුවත් ඉතිරි කර තබන්න.' }
  ],
  [
    { type: 'journaling', text: 'අගයක් සෑදිය හැකි ඔබ සතුව දැනටමත් ඇති දක්ෂතා හෝ ශක්තීන් 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'අන් අයගෙන් ඉගෙනගත් මුදල් පිළිබඳ එක කතාවක් හඳුනාගෙන එය තවමත් ඔබට ගැළපේදැයි බලන්න.' },
    { type: 'action', text: 'ඔබේ එක් දක්ෂතාවක් කෙනෙකුට උපකාර විය හැකි ආකාරයක් ගැන විනාඩි 10ක් සිතන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ වටිනාකම සැබෑය, එය මට අඩු කරගත යුතු නැහැ" යැයි කියන්න.' },
    { type: 'journaling', text: 'මුදල් ගැන ඔබව සීමා කරන එක විශ්වාසයක් ලියලා එය මෘදු ලෙස නැවත ලියන්න.' },
    { type: 'action', text: 'අද ඔබ වටා ඇති කුඩා අවස්ථාවක් එකක් දැක එය සටහන් කරගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ වර්තමාන ආදායම, ඉතිරිය හෝ සහය නිසා සම්භව වන දේ 3ක් අගය කරන්න.' },
    { type: 'journaling', text: 'මුදල් ශක්තිය අඩු කරන පුරුද්දක් එකක් ලියන්න, උදාහරණයක් ලෙස මගහැරීම හෝ වරදකාරී හැඟීම.' },
    { type: 'action', text: 'ප්‍රයෝජනවත් මුදල් හෝ දක්ෂතා මාතෘකාවක් ගැන විනාඩි 10 සිට 15 දක්වා ඉගෙනගන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද මුදල් ගැන අහිතකර ලෙස කතා කළොත් ඒ වචන මෘදු කරන්න.' },
    { type: 'vibration', text: 'ඔබ මුදල් සාමයෙන්, වගකීමෙන්, භය නැතුව පාලනය කරන අයුරු මනසින් දකින්න.' },
    { type: 'action', text: 'අමතර ආදායමක් හෝ සේවාවක් පිළිබඳ අදහසක් එකක් විනිශ්චය නොකර ලියන්න.' }
  ],
  [
    { type: 'vibration', text: '"සමතුලිත සමෘද්ධිය දැන් ඊළඟට කරන්නේ කුමක්ද?" යැයි ඔබගෙන්ම අහන්න.' },
    { type: 'journaling', text: 'දැන් ඔබට කිරීමට සූදානම් කුඩා මුදල් පියවරක් එකක් ලියන්න.' },
    { type: 'action', text: 'වැඩ, ආදායම හෝ අවස්ථාවකට අදාල සරල පණිවිඩයක් හෝ විමසීමක් යවන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මුදල් ඔබට ඉගැන්වූ එක පාඩමක් සඳහා ස්තූතිවන්ත වන්න.' },
    { type: 'mindfulness', text: 'අද මුදල් හෝ වැඩ සම්බන්ධ දෙයක් බලන්නට පෙර විනාඩි 2ක් හුස්ම ගන්න.' },
    { type: 'action', text: 'එක් වියදමක් මෘදු ලෙස බලලා ඊළඟ වතාවේ වෙනස් කළ හැකි දෙයක් සටහන් කරන්න.' }
  ],
  [
    { type: 'journaling', text: 'මෙම සතියේ වගකීමෙන් යුතු සමෘද්ධිමත් පුද්ගලයෙකු ලෙස හැසිරිය හැකි ආකාර 3ක් ලියන්න.' },
    { type: 'vibration', text: '"කුඩා බුද්ධිමත් ක්‍රියා මාව වර්ධනය කරයි" යැයි නැවත කියන්න.' },
    { type: 'action', text: 'ඔබ මගහැර තිබූ මුදල් මතක්කිරීමක්, බිල්පතක් හෝ ලැයිස්තුවක් පිළිවෙලට සකසන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'වැඩි දේ ලබාගැනීම ගැන සිතන විට ඔබේ ශරීරයට දැනෙන හැඟීම සලකා ආතතිය ලිහිල් කරන්න.' },
    { type: 'journaling', text: 'ඔබේ අවංක වටිනාකමට හොඳ මුදලක් ලැබීමට ඔබ සුදුසු වීමට එක හේතුවක් ලියන්න.' },
    { type: 'action', text: 'ආදායමට උපකාරී විය හැකි දක්ෂතාවක්, ප්‍රොෆයිලයක් හෝ අදහසක් සඳහා විනාඩි 10 සිට 20 දක්වා වැඩිදියුණු කිරීමක් කරන්න.' }
  ],
  [
    { type: 'vibration', text: 'මුදලට ගරු කරන සහ මුදල් සමඟ ආරක්ෂිතව දැනෙන පුද්ගලයෙකු ලෙස ඔබවම දකින්න.' },
    { type: 'gratitude', text: 'මේ දක්වා ගත් සෑම කුඩා මුදල් පියවරක් සඳහාම ඔබට ස්තූති කරන්න.' },
    { type: 'action', text: 'අද ඔබව පිළිවෙලට තබාගන්න; එය ස්වයං ගෞරවයේ සලකුණක් වෙන්න.' }
  ],
  [
    { type: 'journaling', text: 'මුදල් බුද්ධියෙන් පාලනය කරන ඔබේ අනාගත ස්වයං ගැන කෙටි විස්තරයක් ලියන්න.' },
    { type: 'mindfulness', text: 'අද වියදම් කිරීමට පෙර එය ඔබේ අනාගත ස්වයංට ගැළපේදැයි නතර වී බලන්න.' },
    { type: 'action', text: 'තවත් ඉතා කුඩා මුදලක් වෙන්කර තබන්න හෝ හදිසි වියදමකින් මුදලක් ආරක්ෂා කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මට මුදල් සමඟ ආධ්‍යාත්මිකවද ප්‍රායෝගිකවද සිටිය හැක" යැයි නැවත කියන්න.' },
    { type: 'journaling', text: 'ඔබව වැඩි ස්ථාවරත්වයකට සහ සමෘද්ධියකට ගෙනයන පුරුද්දක් එකක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ අදහස, පණිවිඩය, ඉදිරිපත් කිරීම හෝ ඉගෙනීමේ මාවතේ කුඩා පියවරක් ගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබගේ මුදල් මනෝභාවයේ දැනටමත් දැනෙන වෙනස්කම් 3ක් ලියන්න.' },
    { type: 'journaling', text: 'දිනය 1ට සාපේක්ෂව දැන් සමෘද්ධිය ඔබට අදහස් කරන දේ ලියන්න.' },
    { type: 'action', text: 'මෙම අභියෝගය අවසන් වුවත් දිගටම කරගෙන යන මෘදු මුදල් පුරුද්දක් එකක් තෝරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 3ක් නිශ්ශබ්දව සිට මේ මොහොතට ප්‍රමාණවත් බවේ සාමය දැනගන්න.' },
    { type: 'vibration', text: 'අද මුදල් ගැනත් ඔබේ අනාගතය ගැනත් ආදරයෙන් කතා කරන්න.' },
    { type: 'action', text: 'මුදල් වර්ධනයට සහය වන සරල ඊළඟ පියවර 3ක් ලැයිස්තුවක් සාදන්න.' }
  ],
  [
    { type: 'gratitude', text: 'දින 21 තුළ ඔබ පැමිණි දුර ගැන ජීවිතයට ස්තූති කරන්න.' },
    { type: 'journaling', text: 'මුදලට අවධානයෙන්, ගෞරවයෙන් සහ විවෘත හදවතින් දිගටම හැසිරෙන බවට පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'ඔබ දැනටමත් සහය ලබන බව දැනෙන කුඩා සන්සුන් ක්‍රියාවකින් මෙම ගමන සමරන්න.' }
  ]
] as const;

const HEALTH_TASKS = [
  [
    { type: 'mindfulness', text: 'Place a hand on your body and thank it for carrying you through life.' },
    { type: 'journaling', text: 'Write one gentle wellness intention for these 21 days.' },
    { type: 'action', text: 'Drink a glass of water slowly and with care.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "My body deserves kindness, not pressure."' },
    { type: 'gratitude', text: 'List 3 things your body still does for you each day.' },
    { type: 'action', text: 'Tidy one small area you use for rest, bathing, or self-care.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one habit that leaves you feeling drained without judging yourself.' },
    { type: 'journaling', text: 'Write how you want health to feel: light, calm, strong, or rested.' },
    { type: 'action', text: 'Take 5 minutes to stretch or move gently.' }
  ],
  [
    { type: 'gratitude', text: 'Thank your body for one part of you that works quietly every day.' },
    { type: 'vibration', text: 'Visualize yourself moving through the day with ease and steady energy.' },
    { type: 'action', text: 'Choose one nourishing drink or snack today.' }
  ],
  [
    { type: 'mindfulness', text: 'Spend 3 minutes breathing slowly and letting your shoulders soften.' },
    { type: 'journaling', text: 'Write 3 small wellness blessings already present in your life.' },
    { type: 'action', text: 'Step outside or near fresh air for a few quiet minutes.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your healthiest self waking up peaceful and cared for.' },
    { type: 'gratitude', text: 'Thank yourself for every attempt you have made to heal or improve.' },
    { type: 'action', text: 'Make your bed or refresh your resting space.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice how your body feels after rest, food, or movement today.' },
    { type: 'vibration', text: 'Repeat, "Healing can happen through gentle consistency."' },
    { type: 'action', text: 'Go to bed a little earlier tonight if you can.' }
  ],
  [
    { type: 'journaling', text: 'List 3 healthy choices you already know how to make.' },
    { type: 'mindfulness', text: 'Notice one pattern that makes you disconnect from your body.' },
    { type: 'action', text: 'Spend 10 minutes learning one simple wellness tip you can use.' }
  ],
  [
    { type: 'vibration', text: 'Say, "I do not need perfection to become healthier."' },
    { type: 'journaling', text: 'Write one belief about your body that you are ready to soften.' },
    { type: 'action', text: 'Prepare one easy healthy option for later today.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 ways your body has supported you through difficult times.' },
    { type: 'mindfulness', text: 'Pause before eating or drinking and take one calm breath.' },
    { type: 'action', text: 'Take a gentle walk for 10 to 15 minutes or move in place.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 strengths that can help you care for your health better.' },
    { type: 'vibration', text: 'Picture yourself making healthy choices without inner struggle.' },
    { type: 'action', text: 'Reduce one small source of overstimulation for part of the day.' }
  ],
  [
    { type: 'mindfulness', text: 'Check in with your energy and ask what your body needs most today.' },
    { type: 'gratitude', text: 'Thank your body before you begin your next meal or drink.' },
    { type: 'action', text: 'Choose one tiny action: extra water, slower eating, or 5 minutes of movement.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Every small caring choice is part of my healing."' },
    { type: 'journaling', text: 'Write one wellness routine you could keep even on a busy day.' },
    { type: 'action', text: 'Refresh something practical for health, like your bottle, towel, or sleep space.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice what time of day your body feels most peaceful and honor it for a moment.' },
    { type: 'journaling', text: 'Write one physical habit and one emotional habit that help you feel better.' },
    { type: 'action', text: 'Spend 10 to 20 minutes doing a gentle healthy action you can repeat.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for the progress no one else can see but you can feel.' },
    { type: 'vibration', text: 'See yourself as a person who naturally cares for their body.' },
    { type: 'action', text: 'Choose clothes, posture, or grooming today that make you feel fresh and alive.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future healthy self in 3 kind sentences.' },
    { type: 'mindfulness', text: 'Ask, "What would my well-rested self choose right now?"' },
    { type: 'action', text: 'Follow that answer in one small way today.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "My body responds to love, rest, and wise action."' },
    { type: 'gratitude', text: 'List 3 healthy choices you have made during this journey.' },
    { type: 'action', text: 'Keep one simple wellness promise to yourself today.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit quietly for 3 minutes and feel the difference between rushing and caring.' },
    { type: 'journaling', text: 'Write the habits that help you feel most like yourself.' },
    { type: 'action', text: 'Set up one tiny support for tomorrow, like water, sleep, or a healthy snack.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for staying present with your health.' },
    { type: 'journaling', text: 'Write 3 inner changes you notice since Day 1.' },
    { type: 'action', text: 'Choose one wellness practice to continue after this challenge.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of caring for yourself gently and steadily.' },
    { type: 'mindfulness', text: 'Let go of one all-or-nothing idea about health.' },
    { type: 'action', text: 'Make a short list of 3 easy health-supporting choices for next week.' }
  ],
  [
    { type: 'gratitude', text: 'Thank your body, your breath, and your effort for staying with you.' },
    { type: 'journaling', text: 'Write one loving promise to your body going forward.' },
    { type: 'action', text: 'Celebrate with one healthy, comforting act that feels nurturing.' }
  ]
] as const;

const LOVE_TASKS = [
  [
    { type: 'mindfulness', text: 'Place a hand on your heart and breathe gently for 2 minutes.' },
    { type: 'journaling', text: 'Write one loving intention for your relationships during these 21 days.' },
    { type: 'action', text: 'Create one small calm space around you that feels warm and peaceful.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "I am worthy of healthy, honest love."' },
    { type: 'gratitude', text: 'List 3 forms of love or kindness already present in your life.' },
    { type: 'action', text: 'Do one kind thing for yourself today without guilt.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one old hurt or fear that still tightens your heart.' },
    { type: 'journaling', text: 'Write how you want love to feel: safe, joyful, gentle, or mutual.' },
    { type: 'action', text: 'Tidy one small personal space as a sign you are making room for better energy.' }
  ],
  [
    { type: 'gratitude', text: 'Thank the people, memories, or moments that have shown you real care.' },
    { type: 'vibration', text: 'Visualize a relationship where you feel seen, respected, and calm.' },
    { type: 'action', text: 'Send one warm message of appreciation with no need for a big reply.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 qualities you already bring into a good relationship.' },
    { type: 'mindfulness', text: 'Notice where love already exists in small daily moments.' },
    { type: 'action', text: 'Choose words today that sound softer and more caring.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your future self receiving love without fear or chasing.' },
    { type: 'gratitude', text: 'Thank your heart for staying open despite past disappointments.' },
    { type: 'action', text: 'Wear or do something today that helps you feel cared for and confident.' }
  ],
  [
    { type: 'mindfulness', text: 'Take 3 calm breaths before reacting in any emotional moment today.' },
    { type: 'vibration', text: 'Repeat, "Love flows better when I feel safe within myself."' },
    { type: 'action', text: 'Offer one genuine compliment or kind word today.' }
  ],
  [
    { type: 'journaling', text: 'List 3 emotional strengths you have in love or friendship.' },
    { type: 'mindfulness', text: 'Notice one pattern that makes you feel distant or guarded.' },
    { type: 'action', text: 'Spend 10 minutes learning one gentle communication idea.' }
  ],
  [
    { type: 'vibration', text: 'Say, "I do not need to abandon myself to receive love."' },
    { type: 'journaling', text: 'Write one belief about love you are ready to release.' },
    { type: 'action', text: 'Practice one clear boundary or honest sentence today.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 ways healthy love begins with self-respect.' },
    { type: 'mindfulness', text: 'Pause and notice how your body feels when someone is kind to you.' },
    { type: 'action', text: 'Make one small repair in a relationship space, message, or routine.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 qualities you want to feel in your relationships, not just see in others.' },
    { type: 'vibration', text: 'Picture yourself speaking with warmth and steadiness.' },
    { type: 'action', text: 'Reach out with one sincere check-in to someone who feels safe.' }
  ],
  [
    { type: 'mindfulness', text: 'Ask yourself, "What would loving maturity look like today?"' },
    { type: 'gratitude', text: 'Thank yourself for any growth in patience, honesty, or softness.' },
    { type: 'action', text: 'Listen fully to one person today without planning your reply.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "I can attract love and also choose wisely."' },
    { type: 'journaling', text: 'Write one small relationship action you are ready to take.' },
    { type: 'action', text: 'Do that action gently, whether it is a message, apology, or kind invitation.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice where you can replace tension with tenderness today.' },
    { type: 'journaling', text: 'Write what emotional safety means to you now.' },
    { type: 'action', text: 'Create one peaceful ritual for connection, even if it is just tea and a calm talk.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for your growing ability to love without losing yourself.' },
    { type: 'vibration', text: 'See yourself as someone who naturally attracts respectful relationships.' },
    { type: 'action', text: 'Carry yourself today in a way that reflects self-worth and openness.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future self in love using 3 grounded, kind sentences.' },
    { type: 'mindfulness', text: 'Before any important conversation, pause for one slow breath.' },
    { type: 'action', text: 'Choose one response today that matches your future self instead of an old pattern.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Healthy love feels calm, honest, and mutual."' },
    { type: 'gratitude', text: 'List 3 ways you have already become softer or clearer.' },
    { type: 'action', text: 'Keep one gentle promise to yourself in love today.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit quietly for 3 minutes and let your heart feel unhurried.' },
    { type: 'journaling', text: 'Write one habit that helps love grow in a healthy way.' },
    { type: 'action', text: 'Take one small action that supports trust, warmth, or emotional clarity.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for the inner changes this journey has opened.' },
    { type: 'journaling', text: 'Write 3 changes you notice in how you now view love.' },
    { type: 'action', text: 'Choose one loving practice to continue after the challenge ends.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of living with softness, self-respect, and openness.' },
    { type: 'mindfulness', text: 'Release one old story that says love must be painful to be real.' },
    { type: 'action', text: 'Write 3 simple next steps for healthier relationships.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for every lesson that brought you back to your heart.' },
    { type: 'journaling', text: 'Write one promise to keep choosing honest and healthy love.' },
    { type: 'action', text: 'Celebrate with one act that makes you feel peaceful, cherished, and whole.' }
  ]
] as const;

const CAREER_TASKS = [
  [
    { type: 'mindfulness', text: 'Sit quietly for 2 minutes and invite clarity into your work life.' },
    { type: 'journaling', text: 'Write one clear career intention for these 21 days.' },
    { type: 'action', text: 'Tidy one small part of your desk, bag, or work space.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "My work can grow in aligned and steady ways."' },
    { type: 'gratitude', text: 'List 3 skills, experiences, or opportunities you already have.' },
    { type: 'action', text: 'Put one work tool, file, or note in better order.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one fear or doubt that makes you hold back professionally.' },
    { type: 'journaling', text: 'Write how you want success to feel: calm, meaningful, respected, or free.' },
    { type: 'action', text: 'Refresh one small part of your appearance or posture to feel more confident.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for all the effort you have already given to your growth.' },
    { type: 'vibration', text: 'Visualize a workday where you feel focused, appreciated, and capable.' },
    { type: 'action', text: 'Write down one current opportunity, even if it is still small.' }
  ],
  [
    { type: 'journaling', text: 'List 3 career blessings already present in your life.' },
    { type: 'mindfulness', text: 'Notice where you compare yourself and return to your own path.' },
    { type: 'action', text: 'Spend 10 minutes reading or watching something useful for your field.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your future professional self walking into the room with quiet confidence.' },
    { type: 'gratitude', text: 'Give thanks for the knowledge and resilience you have built so far.' },
    { type: 'action', text: 'Clear one small task you have been postponing.' }
  ],
  [
    { type: 'mindfulness', text: 'Pause for one breath before starting work and set a calm intention.' },
    { type: 'vibration', text: 'Repeat, "I am allowed to grow without rushing my worth."' },
    { type: 'action', text: 'Write 3 words that describe the professional energy you want to embody.' }
  ],
  [
    { type: 'journaling', text: 'List 3 strengths that make you valuable in your work or studies.' },
    { type: 'mindfulness', text: 'Notice one old pattern that keeps you playing small.' },
    { type: 'action', text: 'Spend 10 minutes reviewing one skill you already know.' }
  ],
  [
    { type: 'vibration', text: 'Say, "My work has value, even while I am still growing."' },
    { type: 'journaling', text: 'Write one career belief you are ready to replace with a kinder truth.' },
    { type: 'action', text: 'Update one tiny part of your resume, profile, or work notes.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 ways your past effort has prepared you for what is next.' },
    { type: 'mindfulness', text: 'Notice where tension enters your body when you think of success.' },
    { type: 'action', text: 'Write one small idea that could improve your current work or path.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 qualities of the version of you who succeeds with integrity.' },
    { type: 'vibration', text: 'Picture yourself speaking clearly and being taken seriously.' },
    { type: 'action', text: 'Spend 10 to 15 minutes learning one practical thing for your growth.' }
  ],
  [
    { type: 'mindfulness', text: 'Ask yourself, "What is one tiny aligned career step I can take today?"' },
    { type: 'gratitude', text: 'Thank yourself for staying connected to your path.' },
    { type: 'action', text: 'Send one simple message, follow-up, or inquiry related to work.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Small steady action opens bigger doors."' },
    { type: 'journaling', text: 'Write one area where you are ready to be more visible.' },
    { type: 'action', text: 'Share one idea, update, or useful contribution in a light way.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice any urge to do everything at once and return to one step.' },
    { type: 'journaling', text: 'Write what kind of success still feels true to your values.' },
    { type: 'action', text: 'Organize one folder, notebook, or document that supports your work.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for the skills and discipline already growing in you.' },
    { type: 'vibration', text: 'See yourself as a consistent and capable professional.' },
    { type: 'action', text: 'Complete one focused 10 to 20 minute work session on something important.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future work self in 3 grounded sentences.' },
    { type: 'mindfulness', text: 'Before starting work, ask what your future self would focus on first.' },
    { type: 'action', text: 'Follow that answer in one small practical way.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "I can be both peaceful and ambitious."' },
    { type: 'gratitude', text: 'List 3 shifts you notice in your confidence or clarity.' },
    { type: 'action', text: 'Take one small step that strengthens your professional identity today.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit for 3 minutes and feel what calm confidence is like in your body.' },
    { type: 'journaling', text: 'Write one habit that would support your success long term.' },
    { type: 'action', text: 'Prepare one small thing tonight that makes tomorrow easier.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for every brave step you have taken in this journey.' },
    { type: 'journaling', text: 'Write 3 real signs of progress from these 21 days.' },
    { type: 'action', text: 'Choose one career habit to continue after the challenge.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of steady progress and self-respect.' },
    { type: 'mindfulness', text: 'Release one success story that says you must burn out to do well.' },
    { type: 'action', text: 'Write a light 3-step plan for your next career move.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for helping you become clearer, steadier, and more ready.' },
    { type: 'journaling', text: 'Write one promise to keep honoring your gifts and your path.' },
    { type: 'action', text: 'Celebrate with one small act that makes you feel capable and renewed.' }
  ]
] as const;

const EDUCATION_TASKS = [
  [
    { type: 'mindfulness', text: 'Sit quietly for 2 minutes and invite focus into your mind.' },
    { type: 'journaling', text: 'Write one learning intention for these 21 days.' },
    { type: 'action', text: 'Tidy your study space, bag, or notes for 5 minutes.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "My mind is open, calm, and ready to learn."' },
    { type: 'gratitude', text: 'List 3 ways knowledge has already helped your life.' },
    { type: 'action', text: 'Prepare one pen, notebook, or digital note space neatly.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one thought that makes studying feel heavy and soften it.' },
    { type: 'journaling', text: 'Write how you want learning to feel: clear, curious, focused, or enjoyable.' },
    { type: 'action', text: 'Read or review something for just 10 minutes today.' }
  ],
  [
    { type: 'gratitude', text: 'Thank your mind for everything it has already understood and remembered.' },
    { type: 'vibration', text: 'Visualize yourself studying with calm concentration.' },
    { type: 'action', text: 'Make one short list of topics, lessons, or areas to focus on.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 learning blessings you already have, such as access, time, or curiosity.' },
    { type: 'mindfulness', text: 'Notice where you already understand more than you give yourself credit for.' },
    { type: 'action', text: 'Take one page of notes in a cleaner, simpler way.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your future self feeling wise, steady, and mentally clear.' },
    { type: 'gratitude', text: 'Thank yourself for every time you kept trying to learn.' },
    { type: 'action', text: 'Remove one distraction from your study area for a while.' }
  ],
  [
    { type: 'mindfulness', text: 'Before studying, take 3 slow breaths and settle your attention.' },
    { type: 'vibration', text: 'Repeat, "I can learn at a peaceful pace and still grow well."' },
    { type: 'action', text: 'Spend 10 to 15 minutes with one lesson, concept, or page.' }
  ],
  [
    { type: 'journaling', text: 'List 3 strengths that help you learn, such as patience, memory, or curiosity.' },
    { type: 'mindfulness', text: 'Notice one study habit or pattern that makes learning harder.' },
    { type: 'action', text: 'Try one simple focus aid, like a timer, silence, or cleaner notes.' }
  ],
  [
    { type: 'vibration', text: 'Say, "I do not need to know everything at once to make progress."' },
    { type: 'journaling', text: 'Rewrite one limiting belief about your intelligence in a kinder way.' },
    { type: 'action', text: 'Summarize one thing you learned today in 3 short lines.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 things you have already learned in life that once felt difficult.' },
    { type: 'mindfulness', text: 'Notice how your body feels when you study with less pressure.' },
    { type: 'action', text: 'Spend 10 minutes reviewing instead of rushing into too much new material.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 qualities of the learner you are becoming.' },
    { type: 'vibration', text: 'Picture yourself understanding things with more ease and trust.' },
    { type: 'action', text: 'Choose one question or topic to explore a little deeper today.' }
  ],
  [
    { type: 'mindfulness', text: 'Ask yourself, "What is one tiny study action that would help today?"' },
    { type: 'gratitude', text: 'Thank yourself for staying connected to your growth.' },
    { type: 'action', text: 'Do one short focused study session, even if it is only 10 minutes.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Each small study session is building a stronger mind."' },
    { type: 'journaling', text: 'Write one subject or skill you want to become more confident in.' },
    { type: 'action', text: 'Organize one set of notes, bookmarks, or saved learning links.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice any urge to rush, then return to one lesson at a time.' },
    { type: 'journaling', text: 'Write what wise learning looks like for you now.' },
    { type: 'action', text: 'Teach or explain one simple idea out loud to yourself.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for the growth already happening in your thinking.' },
    { type: 'vibration', text: 'See yourself as a focused and capable learner.' },
    { type: 'action', text: 'Spend 10 to 20 minutes on one meaningful learning task.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future wise and disciplined self in 3 kind sentences.' },
    { type: 'mindfulness', text: 'Before you study, ask what your future self would do first.' },
    { type: 'action', text: 'Follow that answer with one small real step.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "My mind becomes clearer through gentle consistency."' },
    { type: 'gratitude', text: 'List 3 signs that your focus or confidence is improving.' },
    { type: 'action', text: 'Keep one simple study promise to yourself today.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit for 3 minutes and feel what a settled, concentrated mind is like.' },
    { type: 'journaling', text: 'Write one learning habit you want to keep beyond this challenge.' },
    { type: 'action', text: 'Prepare one small support for tomorrow, like a note, topic, or timer.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for choosing growth again and again.' },
    { type: 'journaling', text: 'Write 3 changes you notice in your mindset toward learning.' },
    { type: 'action', text: 'Choose one study habit to continue after Day 21.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of learning with steadiness and curiosity.' },
    { type: 'mindfulness', text: 'Release one fear that says you are behind.' },
    { type: 'action', text: 'Write a simple 3-step learning path for what comes next.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for every lesson, teacher, and insight that has shaped you.' },
    { type: 'journaling', text: 'Write one promise to keep honoring your mind and your growth.' },
    { type: 'action', text: 'Celebrate with one peaceful act that makes learning feel joyful.' }
  ]
] as const;

const PEACE_TASKS = [
  [
    { type: 'mindfulness', text: 'Sit in silence for 2 minutes and notice your breath without forcing it.' },
    { type: 'journaling', text: 'Write one intention for more inner peace during these 21 days.' },
    { type: 'action', text: 'Clear one small area around you to make the space feel lighter.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "Peace is allowed to live in me now."' },
    { type: 'gratitude', text: 'List 3 quiet comforts already present in your life.' },
    { type: 'action', text: 'Lower one source of noise, clutter, or digital input for a while.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one thought loop that steals your peace and name it gently.' },
    { type: 'journaling', text: 'Write how peace feels to you: soft, spacious, still, or safe.' },
    { type: 'action', text: 'Take 5 minutes away from screens if possible.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for one peaceful moment you experienced recently.' },
    { type: 'vibration', text: 'Visualize your day unfolding with less rushing and more steadiness.' },
    { type: 'action', text: 'Drink water or tea slowly and without multitasking.' }
  ],
  [
    { type: 'journaling', text: 'List 3 blessings that help you feel supported or grounded.' },
    { type: 'mindfulness', text: 'Spend 3 minutes noticing the calm that exists underneath the noise.' },
    { type: 'action', text: 'Choose one thing to do more slowly today.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your future self moving through stress with calm presence.' },
    { type: 'gratitude', text: 'Thank yourself for every time you chose peace instead of drama.' },
    { type: 'action', text: 'Refresh one comfort space, such as your bed, desk, or prayer corner.' }
  ],
  [
    { type: 'mindfulness', text: 'Pause before reacting today and take one full breath first.' },
    { type: 'vibration', text: 'Repeat, "My peace matters, and I can protect it kindly."' },
    { type: 'action', text: 'Take a short quiet walk or stand near fresh air for a few minutes.' }
  ],
  [
    { type: 'journaling', text: 'List 3 things that help you return to yourself when life feels loud.' },
    { type: 'mindfulness', text: 'Notice one pattern, person, or habit that disturbs your inner calm.' },
    { type: 'action', text: 'Spend 10 minutes learning a simple calming practice or reflection.' }
  ],
  [
    { type: 'vibration', text: 'Say, "I release the idea that chaos makes me important."' },
    { type: 'journaling', text: 'Write one belief about stress that you are ready to soften.' },
    { type: 'action', text: 'Set one light boundary today that protects your energy.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 peaceful qualities already growing inside you.' },
    { type: 'mindfulness', text: 'Notice what your body feels like when you stop rushing for a moment.' },
    { type: 'action', text: 'Choose one task today and do it quietly, one step at a time.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 strengths that help you stay centered.' },
    { type: 'vibration', text: 'Picture yourself staying soft even when life is imperfect.' },
    { type: 'action', text: 'Reduce one form of overstimulation for 10 to 20 minutes.' }
  ],
  [
    { type: 'mindfulness', text: 'Ask yourself, "What would bring me back to center right now?"' },
    { type: 'gratitude', text: 'Thank yourself for every small peaceful choice you have made.' },
    { type: 'action', text: 'Do one calming action now, such as breathing, stretching, or sitting quietly.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Peace grows through small gentle choices."' },
    { type: 'journaling', text: 'Write one daily habit that helps your mind feel lighter.' },
    { type: 'action', text: 'Organize one small thing that has been mentally noisy.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice how much energy you save when you do not argue with every thought.' },
    { type: 'journaling', text: 'Write what an emotionally peaceful life means to you now.' },
    { type: 'action', text: 'Choose one peaceful response today where you once would have rushed or reacted.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for the quiet strength growing inside you.' },
    { type: 'vibration', text: 'See yourself as someone who carries calm into every room.' },
    { type: 'action', text: 'Wear, clean, or arrange something today that makes you feel lighter.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future peaceful self in 3 grounded sentences.' },
    { type: 'mindfulness', text: 'Before your next task, ask what your peaceful self would do differently.' },
    { type: 'action', text: 'Take one small action that matches that version of you.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "I can be calm and still fully engaged with life."' },
    { type: 'gratitude', text: 'List 3 changes you notice in your energy or reactions.' },
    { type: 'action', text: 'Keep one simple peace-supporting promise to yourself today.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit for 3 minutes and let stillness be enough.' },
    { type: 'journaling', text: 'Write one habit you want to keep to protect your peace.' },
    { type: 'action', text: 'Prepare one small support for tomorrow, such as a quiet start or less screen time.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for choosing peace even in tiny ways.' },
    { type: 'journaling', text: 'Write 3 inner changes you notice since Day 1.' },
    { type: 'action', text: 'Choose one calming practice to continue after this challenge.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of moving through life with more space and ease.' },
    { type: 'mindfulness', text: 'Release one story that says you must stay busy to feel safe.' },
    { type: 'action', text: 'Write 3 simple next steps for protecting your inner peace.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for every quiet lesson that brought you back to yourself.' },
    { type: 'journaling', text: 'Write one promise to keep honoring your peace.' },
    { type: 'action', text: 'Celebrate with one small act that feels soothing and deeply calm.' }
  ]
] as const;

const SPIRITUAL_TASKS = [
  [
    { type: 'mindfulness', text: 'Sit quietly for 3 minutes and simply notice that you are here.' },
    { type: 'journaling', text: 'Write one spiritual intention for these 21 days.' },
    { type: 'action', text: 'Create one small clean space for silence, prayer, or reflection.' }
  ],
  [
    { type: 'vibration', text: 'Say softly, "I am open to guidance, wisdom, and inner truth."' },
    { type: 'gratitude', text: 'List 3 things in life that make you feel connected or humbled.' },
    { type: 'action', text: 'Lightly tidy something symbolic, like a candle area, journal space, or quiet corner.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice one fear, confusion, or heaviness you want to release.' },
    { type: 'journaling', text: 'Write how you want your spiritual life to feel: grounded, guided, trusting, or clear.' },
    { type: 'action', text: 'Spend 5 minutes in silence without trying to force an experience.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life for one lesson that helped you grow inwardly.' },
    { type: 'vibration', text: 'Visualize yourself walking through the day with inner guidance.' },
    { type: 'action', text: 'Read or listen to one short uplifting spiritual message.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 ways grace, support, or meaning already appears in your life.' },
    { type: 'mindfulness', text: 'Notice one simple moment today that feels sacred or quietly beautiful.' },
    { type: 'action', text: 'Step outside and observe nature with full attention for a few minutes.' }
  ],
  [
    { type: 'vibration', text: 'Imagine your future self living with deeper trust and inner steadiness.' },
    { type: 'gratitude', text: 'Thank yourself for continuing to seek truth with sincerity.' },
    { type: 'action', text: 'Write one question your soul is gently asking right now.' }
  ],
  [
    { type: 'mindfulness', text: 'Take 3 slow breaths before starting your day and listen inwardly.' },
    { type: 'vibration', text: 'Repeat, "I do not need noise to feel connected."' },
    { type: 'action', text: 'Choose one small act today and do it with full presence.' }
  ],
  [
    { type: 'journaling', text: 'List 3 inner strengths that support your spiritual growth.' },
    { type: 'mindfulness', text: 'Notice one pattern that pulls you away from your center.' },
    { type: 'action', text: 'Spend 10 minutes with a spiritual book, reflection, or quiet teaching.' }
  ],
  [
    { type: 'vibration', text: 'Say, "I can trust life more than my old fear."' },
    { type: 'journaling', text: 'Write one limiting belief about yourself or life that you are ready to soften.' },
    { type: 'action', text: 'Release one small item, thought, or habit that feels spiritually heavy.' }
  ],
  [
    { type: 'gratitude', text: 'List 3 moments that have felt like quiet guidance in your life.' },
    { type: 'mindfulness', text: 'Notice what changes in you when you slow down enough to listen.' },
    { type: 'action', text: 'Spend 5 to 10 minutes in prayer, reflection, or silent listening.' }
  ],
  [
    { type: 'journaling', text: 'Write 3 qualities of the spiritually mature person you are becoming.' },
    { type: 'vibration', text: 'Picture yourself responding to life with trust instead of panic.' },
    { type: 'action', text: 'Do one small act of kindness with full awareness.' }
  ],
  [
    { type: 'mindfulness', text: 'Ask yourself, "What is one aligned step my spirit is ready for now?"' },
    { type: 'gratitude', text: 'Thank yourself for staying open to growth and meaning.' },
    { type: 'action', text: 'Take one tiny action that reflects your values today.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "Inner alignment becomes clearer through small faithful steps."' },
    { type: 'journaling', text: 'Write one practice that helps you feel closest to your deeper self.' },
    { type: 'action', text: 'Create 10 minutes of intentional quiet in your day.' }
  ],
  [
    { type: 'mindfulness', text: 'Notice where you already feel more grounded than you did before.' },
    { type: 'journaling', text: 'Write what spiritual strength means to you now.' },
    { type: 'action', text: 'Choose one moment today to pause instead of rushing.' }
  ],
  [
    { type: 'gratitude', text: 'Give thanks for your path, even the parts that shaped you slowly.' },
    { type: 'vibration', text: 'See yourself as someone who lives from inner truth more often.' },
    { type: 'action', text: 'Let your outer actions today reflect more simplicity, care, and presence.' }
  ],
  [
    { type: 'journaling', text: 'Describe your future spiritually grounded self in 3 kind sentences.' },
    { type: 'mindfulness', text: 'Before your next choice, ask what your higher self would do.' },
    { type: 'action', text: 'Follow that guidance in one small practical way.' }
  ],
  [
    { type: 'vibration', text: 'Repeat, "I am becoming more aligned, more present, and more trusting."' },
    { type: 'gratitude', text: 'List 3 inner shifts you notice from this journey.' },
    { type: 'action', text: 'Keep one meaningful spiritual practice today, even if it is brief.' }
  ],
  [
    { type: 'mindfulness', text: 'Sit for 3 minutes and let silence teach you something simple.' },
    { type: 'journaling', text: 'Write one spiritual habit you want to keep after Day 21.' },
    { type: 'action', text: 'Prepare one small support for tomorrow, like a journal, quote, or quiet time.' }
  ],
  [
    { type: 'gratitude', text: 'Thank yourself for meeting this journey with sincerity.' },
    { type: 'journaling', text: 'Write 3 ways your connection to life, self, or meaning feels different now.' },
    { type: 'action', text: 'Choose one grounding practice to continue beyond the challenge.' }
  ],
  [
    { type: 'vibration', text: 'Visualize the next month of living with more trust, presence, and depth.' },
    { type: 'mindfulness', text: 'Release one spiritual expectation that feels performative or forced.' },
    { type: 'action', text: 'Write 3 gentle next steps for your spiritual path.' }
  ],
  [
    { type: 'gratitude', text: 'Thank life, your spirit, and this path for what has opened in you.' },
    { type: 'journaling', text: 'Write one promise to keep listening to your inner guidance.' },
    { type: 'action', text: 'Celebrate with one quiet act that makes you feel deeply connected.' }
  ]
] as const;

function getWealthDayTitleSinhala(day: number): string {
  const titles = [
    "සෞභාග්‍යයට ඉඩ සලසා ගැනීම", "කෘතඥතාවයේ බලය", "මුදල් ගැන ධනාත්මක දැක්ම", "ත්‍යාගශීලී බව", "අනාගතය දෘශ්‍යමාන කිරීම",
    "ණය බරින් නිදහස් වන හැඟීම", "ලැබීම් අගය කිරීම", "ධනවත් පුරුදු", "අවස්ථාවන් හඳුනා ගැනීම", "ස්වයං වටිනාකම",
    "මුදල් ගලා ඒම", "සාර්ථකත්වයේ සතුට", "බිය දුරු කිරීම", "විශ්වාසය ගොඩනැගීම", "අරමුණු ස්ථිර කිරීම",
    "ක්‍රියාත්මක වීම", "බාධා ජය ගැනීම", "පොහොසත් මනස", "ආයෝජනය සහ ඉතිරිය", "පූර්ණ තෘප්තිය", "විශ්වයට ස්තූති කිරීම"
  ];
  return titles[day - 1] || "සෞභාග්‍යයේ දිනයක්";
}

function getWealthDayDescSinhala(day: number): string {
  const descs = [
    "අද අපි ඔබේ මනස සහ පරිසරය ධනය පිළිගැනීමට සූදානම් කරමු.",
    "ඔබට දැනටමත් ඇති දේ ගැන ස්තූතිවන්ත වීමෙන් තවත් දේ ආකර්ෂණය වේ.",
    "මුදල් යනු ශක්තියකි. එය ගැන ඇති බිය හෝ පිළිකුල ඉවත් කරන්න.",
    "දීම තුළින් ලැබීම තහවුරු වේ. කුඩා දෙයක් හෝ පරිත්‍යාග කරන්න.",
    "ඔබේ සිහින ජීවිතය දැනටමත් ලැබී ඇති බව සිතින් මවාගන්න.",
    "ණය ගැන දුක් නොවී, ඒවා ගෙවා නිම කරන ආකාරය ගැන සිතන්න.",
    "කුඩා මුදලක් ලැබුණත් එය ආදරයෙන් පිළිගන්න.",
    "ධනවත් මිනිසුන් සිතන ආකාරය ගැන අවධානය යොමු කරන්න.",
    "ඔබ වටා ඇති මුදල් ඉපැයීමේ අවස්ථා දෙස විමසිල්ලෙන් බලන්න.",
    "ඔබ ධනය ලැබීමට සුදුසු බව ඔබටම කියා දෙන්න.",
    "මුදල් පහසුවෙන් ඔබ වෙත ගලා එන බව විශ්වාස කරන්න.",
    "අන් අයගේ දියුණුව දැක සතුටු වන්න. ඊර්ෂ්‍යාව දුරු කරන්න.",
    "මුදල් නැති වේ යැයි ඇති බිය අතහරින්න.",
    "ඔබේ තීරණ ගැන විශ්වාසය තබන්න.",
    "ඔබට අවශ්‍ය මුදල් ප්‍රමාණය සහ එයින් කරන දේ ලියා තබන්න.",
    "සිහින දැකීම පමණක් මදි, අද කුඩා පියවරක් තබන්න.",
    "අභියෝග යනු දියුණුවට පාර කියන සලකුණු බව මතක තබාගන්න.",
    "හිඟකම වෙනුවට බහුලත්වය ගැන සිතන්න.",
    "මුදල් පාලනය කිරීමේ වැදගත්කම තේරුම් ගන්න.",
    "ලැබුණු දෙයින් සතුටු වන්න, තවත් දේ ලැබෙනු ඇත.",
    "මේ දින 21 පුරා ලැබුණු ශක්තියට විශ්වයට ස්තූති කරන්න."
  ];
  return descs[day - 1] || "අද දවස ඔබේ ධනවත් භාවය වෙනුවෙන් වෙන් කරන්න.";
}

function getWealthAffirmationSinhala(day: number): string {
  const affs = [
    "මම සෞභාග්‍යය ආදරයෙන් පිළිගනිමි.",
    "මට ඇති සියලු දේට මම ස්තූතිවන්ත වෙමි.",
    "මුදල් යනු මගේ ජීවිතය පහසු කරන යහපත් දෙයකි.",
    "මම දෙන දෙය මට දෙගුණයක් වී නැවත ලැබේ.",
    "මම පොහොසත් ජීවිතයක් ගත කරමි.",
    "මම මූල්‍යමය නිදහස ලබමි.",
    "සෑම මුදල් නෝට්ටුවක්ම මට ආශිර්වාදයකි.",
    "මම ධනවත් මනසක් ඇත්තෙමි.",
    "සෑම තැනකම මට අවස්ථා පෙනේ.",
    "මම ධනය ලැබීමට සුදුසුයි.",
    "මුදල් ගඟක් මෙන් මා වෙත ගලා එයි.",
    "මම අන් අයගේ සාර්ථකත්වයට ආශිර්වාද කරමි.",
    "මම ආරක්ෂිතයි. විශ්වය මට සපයයි.",
    "මගේ තීරණ නිවැරදියි.",
    "මගේ අරමුණු පැහැදිලියි.",
    "මම මගේ සිහින වෙනුවෙන් වැඩ කරමි.",
    "මට ඕනෑම බාධාවක් ජය ගත හැක.",
    "ලෝකයේ සැමට ප්‍රමාණවත් ධනයක් ඇත.",
    "මම මුදල් බුද්ධිමත්ව භාවිතා කරමි.",
    "මගේ ජීවිතය සම්පූර්ණයි.",
    "ස්තූතියි විශ්වය, මම සූදානම්."
  ];
  return affs[day - 1] || "මම ධනවත් වෙමි.";
}

function getWealthTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, WEALTH_TASKS as any);
}

// --- Health Helpers ---
function getHealthDayTitle(day: number): string {
  return `සෞඛ්‍ය සම්පන්න දිනයක් ${day}`;
}
function getHealthDayDesc(day: number): string {
  return "ඔබේ ශරීරයට සහ මනසට සුවය ලබා දෙන ක්‍රියාවන්හි නිරත වන්න.";
}
function getHealthAffirmation(day: number): string {
  return "මම පූර්ණ සෞඛ්‍යයෙන් පසුවෙමි.";
}
function getHealthTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, HEALTH_TASKS as any);
}

// --- Love Helpers ---
function getLoveDayTitle(day: number): string {
  return `ආදරය පිරුණු දිනයක් ${day}`;
}
function getLoveDayDesc(day: number): string {
  return "ආදරය දීම සහ ලැබීම ගැන අද අවධානය යොමු කරන්න.";
}
function getLoveAffirmation(day: number): string {
  return "මම ආදරය ලැබීමට සුදුසුයි.";
}
function getLoveTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, LOVE_TASKS as any);
}

// --- Career Helpers ---
function getCareerDayTitle(day: number): string {
  return `වෘත්තීය දියුණුව ${day}`;
}
function getCareerDayDesc(day: number): string {
  return "ඔබේ රැකියාවේ හෝ ව්‍යාපාරයේ දියුණුව වෙනුවෙන් කැපවන්න.";
}
function getCareerAffirmation(day: number): string {
  return "මම මගේ රැකියාවට ආදරෙයි. මම සාර්ථකයි.";
}
function getCareerTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, CAREER_TASKS as any);
}

// --- Education Helpers ---
function getEducationDayTitle(day: number): string {
  return `දැනුම සොයා යාම ${day}`;
}
function getEducationDayDesc(day: number): string {
  return "ඉගෙනීම පහසු සහ විනෝදජනක දෙයක් බව සිතන්න.";
}
function getEducationAffirmation(day: number): string {
  return "මට ඕනෑම දෙයක් පහසුවෙන් මතක තබා ගත හැක.";
}
function getEducationTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, EDUCATION_TASKS as any);
}

// --- Peace Helpers ---
function getPeaceDayTitle(day: number): string {
  return `සන්සුන් මනස ${day}`;
}
function getPeaceDayDesc(day: number): string {
  return "බාහිර ලෝකයේ කලබල අතහැර අභ්‍යන්තර සාමය සොයා යන්න.";
}
function getPeaceAffirmation(day: number): string {
  return "මම ඉතා සන්සුන් පුද්ගලයෙකි.";
}
function getPeaceTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, PEACE_TASKS as any);
}

// --- Spiritual Helpers ---
function getSpiritualDayTitle(day: number): string {
  return `ආධ්‍යාත්මික පිබිදීම ${day}`;
}
function getSpiritualDayDesc(day: number): string {
  return "විශ්වය සමඟ ඇති ඔබේ සම්බන්ධතාවය අලුත් කරගන්න.";
}
function getSpiritualAffirmation(day: number): string {
  return "විශ්වය සැමවිටම මා ආරක්ෂා කරයි.";
}
function getSpiritualTasks(day: number): any[] {
  if (isInitializingLOAContent) return [];
  return buildSpecificTasks(day, SPIRITUAL_TASKS as any);
}

isInitializingLOAContent = false;

LOA_CONTENT.wealth.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getWealthDayTitle(i + 1)}`,
  miniDescription: getWealthDayDesc(i + 1),
  affirmation: getWealthAffirmation(i + 1),
  tasks: getWealthTasks(i + 1)
}));

LOA_CONTENT.health.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getHealthDayTitle(i + 1)}`,
  miniDescription: getHealthDayDesc(i + 1),
  affirmation: getHealthAffirmation(i + 1),
  tasks: getHealthTasks(i + 1)
}));

LOA_CONTENT.love.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getLoveDayTitle(i + 1)}`,
  miniDescription: getLoveDayDesc(i + 1),
  affirmation: getLoveAffirmation(i + 1),
  tasks: getLoveTasks(i + 1)
}));

LOA_CONTENT.career.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getCareerDayTitle(i + 1)}`,
  miniDescription: getCareerDayDesc(i + 1),
  affirmation: getCareerAffirmation(i + 1),
  tasks: getCareerTasks(i + 1)
}));

LOA_CONTENT.education.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getEducationDayTitle(i + 1)}`,
  miniDescription: getEducationDayDesc(i + 1),
  affirmation: getEducationAffirmation(i + 1),
  tasks: getEducationTasks(i + 1)
}));

LOA_CONTENT.peace.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getPeaceDayTitle(i + 1)}`,
  miniDescription: getPeaceDayDesc(i + 1),
  affirmation: getPeaceAffirmation(i + 1),
  tasks: getPeaceTasks(i + 1)
}));

LOA_CONTENT.spiritual.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `à¶¯à·’à¶± ${i + 1}: ${getSpiritualDayTitle(i + 1)}`,
  miniDescription: getSpiritualDayDesc(i + 1),
  affirmation: getSpiritualAffirmation(i + 1),
  tasks: getSpiritualTasks(i + 1)
}));

function getWealthDayTitle(day: number): string {
  const titles = [
    "සෞභාග්‍යයට ඉඩ සලසා ගැනීම",
    "කෘතඥතාවයේ බලය",
    "මුදල් ගැන හොඳ දෘෂ්ටිය",
    "ගෞරවයෙන් ලබා ගැනීම",
    "සමෘද්ධිය දැනගැනීම",
    "අනාගතය දෘශ්‍යමාන කිරීම",
    "ඉතිරියේ ආරම්භය",
    "ඔබේ දක්ෂතා හඳුනාගැනීම",
    "සීමා විශ්වාස මෘදු කිරීම",
    "මුදල් ශක්තිය පිරිසිදු කිරීම",
    "අදහස් විවෘත කිරීම",
    "කුඩා ක්‍රියා ආරම්භ කිරීම",
    "සංවේදී වියදම් අවධානය",
    "වගකීමෙන් වර්ධනය වීම",
    "වටිනාකම පිළිගැනීම",
    "අනාගත ස්වයං හඳුනාගැනීම",
    "ස්ථාවරත්වය තෝරාගැනීම",
    "ප්‍රායෝගික සමෘද්ධිය",
    "වෙනස දැනගැනීම",
    "ඊළඟ පියවර සැකසීම",
    "ගමනට ස්තූති කිරීම"
  ];
  return titles[day - 1] || "ධනයේ නව පියවර";
}

function getWealthDayDesc(day: number): string {
  const descs = [
    "අද ඔබේ මනස සහ පරිසරය ධනය පිළිගැනීමට සූදානම් කරගන්න.",
    "දැනටමත් ඇති දේ අගය කිරීමෙන් තවත් යහපතට ඉඩ ලැබේ.",
    "මුදල් ගැන බිය අඩු කර සන්සුන් ආකාරයක් තෝරාගන්න.",
    "මුදලට ගෞරවය දක්වද්දී එය සමඟ සම්බන්ධය මෘදුව වෙනස් වේ.",
    "සමෘද්ධිය දැනටමත් ඔබේ ජීවිතයේ කොතැනකද කියා බලන්න.",
    "ඔබ කැමති මුදල්මය ජීවිතය මනසින් පැහැදිලි කරගන්න.",
    "කුඩා ඉතිරියක් පවා නව ශක්තියක් ගෙන එයි.",
    "ඔබ සතුව දැනටමත් ඇති වටිනාකම හඳුනාගන්න.",
    "සීමා කරන මුදල් විශ්වාස මෘදු කරගන්න.",
    "මුදල් ශක්තිය කාන්දු කරන පුරුදු හඳුනාගන්න.",
    "කුඩා අදහස් විවෘත කර අවස්ථාවක් දැකගන්න.",
    "මනස සහ ක්‍රියාව අතර පාලමක් අද ගොඩනගන්න.",
    "සන්සුන් අවධානයෙන් වියදම් පුරුදු බලන්න.",
    "වගකීමත් සමෘද්ධියත් එකට ගෙනයන්න.",
    "ඔබේ වටිනාකම පිළිගැනීම මුදල්මය විශ්වාසය වර්ධනය කරයි.",
    "අනාගතයේ බුද්ධිමත් ඔබ අදම හැඳිනගන්න.",
    "කුඩා ස්ථාවර පියවර විශාල වෙනසකට මුල වේ.",
    "ආධ්‍යාත්මික හැඟීම සහ සැබෑ ක්‍රියාව එකට ගෙනයන්න.",
    "ඔබ තුළ ඇති වෙනස්කම් සලකා බලන්න.",
    "අභියෝගය අවසානයෙන් පසු මෘදු පියවර සැලසුම් කරන්න.",
    "මෙම ගමන ඔබට දුන් ශක්තියට හදවතින් ස්තූති කරන්න."
  ];
  return descs[day - 1] || "අද ඔබේ සමෘද්ධියට සහය වන කුඩා පියවරක් ගන්න.";
}

function getWealthAffirmation(day: number): string {
  const affs = [
    "මම සමෘද්ධිය ආදරයෙන් පිළිගනිමි.",
    "මට ඇති දේ ගැන මම කෘතඥ වෙමි.",
    "මුදල් සමඟ මගේ සම්බන්ධය සන්සුන් වෙමින් පවතී.",
    "මම මුදලට ගෞරවය දක්වමි.",
    "සමෘද්ධිය දැනටමත් මගේ ජීවිතයේ ඇත.",
    "මගේ යහපත් අනාගතය මම පැහැදිලිව දකිමි.",
    "කුඩා ඉතිරියක් වුවද මගේ වර්ධනයට අරුතක් ඇත.",
    "මගේ දක්ෂතා අගය සෑදිය හැකිය.",
    "සීමා කරන සිතුවිලි මම මෘදු ලෙස හැරදමමි.",
    "මගේ මුදල් ශක්තිය වැඩි වැඩියෙන් පැහැදිලි වෙයි.",
    "මට ගැළපෙන අවස්ථා මට පෙනේ.",
    "මම කුඩා සැබෑ පියවර ගන්නෙමි.",
    "මම මුදල් ගැන සන්සුන්ව අවධානයෙන් සිටිමි.",
    "වගකීමත් සමෘද්ධියත් මට එකට ගෙනයන්න පුළුවනි.",
    "මගේ වටිනාකමට මම ගෞරව කරමි.",
    "බුද්ධිමත් අනාගතයේ මම අදම ගොඩනඟමි.",
    "ස්ථාවර කුඩා පියවර මාව ඉදිරියට ගෙනයයි.",
    "මම ආධ්‍යාත්මිකවද ප්‍රායෝගිකවද වර්ධනය වෙමි.",
    "මගේ මුදල් මනෝභාවය හොඳ අතට වෙනස් වෙයි.",
    "මම මගේ ඊළඟ පියවර සන්සුන්ව තෝරමි.",
    "ස්තූතියි ජීවිතය, මම වර්ධනය වෙමින් සිටිමි."
  ];
  return affs[day - 1] || "මම සන්සුන් සමෘද්ධියට සුදුසුය.";
}

LOA_CONTENT.wealth.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}: ${getWealthDayTitleSinhala(i + 1)}`,
  miniDescription: getWealthDayDescSinhala(i + 1),
  affirmation: getWealthAffirmationSinhala(i + 1),
  tasks: getWealthTasks(i + 1)
}));

// Sinhala LOA overrides

type LOASinhalaTaskType = 'action' | 'gratitude' | 'vibration' | 'mindfulness' | 'journaling';

function buildLocalizedSpecificTasks(
  day: number,
  tasksByDay: { text: string; type: LOASinhalaTaskType }[][]
): any[] {
  const dayTasks = tasksByDay[day - 1] || tasksByDay[0];
  return dayTasks.map((t, i) => ({
    id: `day${day}_task${i + 1}`,
    ...t
  }));
}

function getLocalizedPhaseIndex(day: number): number {
  if (day <= 3) return 0;
  if (day <= 7) return 1;
  if (day <= 11) return 2;
  if (day <= 15) return 3;
  if (day <= 18) return 4;
  return 5;
}

function getLocalizedGoalMiniDescription(goal: 'health' | 'love' | 'career' | 'education' | 'peace' | 'spiritual', day: number): string {
  const phase = getLocalizedPhaseIndex(day);
  const descriptions = {
    health: [
      'අද ඔබේ ශරීරයට සහ මනසට මෘදු ආරම්භයක් දෙන්න.',
      'ඔබ තුළ තිබෙන සුව ශක්තිය හඳුනාගෙන ඒ සමඟ සම්බන්ධ වන්න.',
      'ඔබට හොඳ හැඟීමක් දෙන්නේ කුමක්ද කියා අවධානයෙන් බලන්න.',
      'සුවයට සහාය වන කුඩා දෛනික තේරීම් අද සැහැල්ලුවෙන් ගන්න.',
      'සුවපත් පුද්ගලයෙකු ලෙස අද දවසේ ඔබව හැසිරවන්න.',
      'මෙම ගමනේ ලැබුණු වෙනස්කම් හඳුනාගෙන ඉදිරියට ගෙන යන්න.'
    ],
    love: [
      'අද හදවතට මෘදු බව සහ ආදරයට ඉඩ දෙන්න.',
      'දැනට තිබෙන ආදරය සහ උණුසුම අගය කරන්න.',
      'ඔබේ හදවතේ අවශ්‍යතා සහ සීමා පිරිසිදුව හඳුනාගන්න.',
      'සම්බන්ධතා උණුසුම් කරන කුඩා සැබෑ පියවරක් ගන්න.',
      'ආදරයට සුදුසු පුද්ගලයෙකු ලෙස ඔබවම දැනගන්න.',
      'ආදරය ගැන ලැබුණු අභ්‍යන්තර වර්ධනය සන්සුන්ව පිළිගන්න.'
    ],
    career: [
      'ඔබේ හැකියාවන්ට සහ අනාගතයට අද මෘදු අවධානයක් දෙන්න.',
      'දැනටමත් ඔබ සතුව ඇති වටිනාකම සහ අවස්ථා හඳුනාගන්න.',
      'ඔබට ඉදිරියට යාමට බාධා කරන සිතුවිලි මෘදු ලෙස වෙනස් කරන්න.',
      'වෘත්තීය දිශාවට කුඩා සැබෑ ක්‍රියාවක් ගන්න.',
      'සාර්ථක පුද්ගලයෙකු ලෙස ඔබේ පුරුදු සහ ශක්තිය හැඩගස්වන්න.',
      'ලැබුණු පැහැදිලි බව රැගෙන ඉදිරි පියවර වෙත යන්න.'
    ],
    education: [
      'අද ඉගෙනීමට මනස මෘදු ලෙස විවෘත කරන්න.',
      'දැනටමත් ඔබ දන්නා දේ සහ ඔබේ කුතුහලය අගය කරන්න.',
      'ඉගෙනීමට බාධා කරන රටාවන් හඳුනාගෙන සැහැල්ලුවෙන් මාරු කරන්න.',
      'කුඩා ඉගෙනුම් ක්‍රියාවකින් දැනුමට ආරාධනා කරන්න.',
      'පිළිවෙල සහ සන්සුන් අවධානයෙන් ඔබේ අධ්‍යාපනික අනන්‍යතාවය ගොඩනගන්න.',
      'ඉගෙනුම් ගමනේ ලැබුණු විශ්වාසය සහ පැහැදිලි බව සුරකින්න.'
    ],
    peace: [
      'අද ඔබේ මනසට සහ හුස්මට නිදහස් ඉඩක් දෙන්න.',
      'දැනටමත් ජීවිතයේ ඇති සන්සුන් මොහොතක් හඳුනාගන්න.',
      'අභ්‍යන්තර කැළඹීම ඇති කරන රටාවන් මෘදු ලෙස අවධානයට ගන්න.',
      'සන්සුන් බවට සහාය වන කුඩා සැබෑ පියවරක් ගන්න.',
      'සන්සුන් පුද්ගලයෙකු ලෙස දවසේ ගමන අත්විඳින්න.',
      'මෙම දිනවල ගොඩනගාගත් සාමය ඉදිරියට රැගෙන යන්න.'
    ],
    spiritual: [
      'අද ඔබේ අභ්‍යන්තර හඬ සහ නිහඬතාවය වෙත මෘදුව හැරෙන්න.',
      'දැනටමත් ඔබව මඟ පෙන්වන ආශීර්වාද සහ සංඥා හඳුනාගන්න.',
      'ඔබ තුළ ඇති සැක සහ අවහිරකම් මෘදු ලෙස ලිහිල් කරන්න.',
      'ආත්මික හැඟීම යථාර්ථයට බැඳෙන කුඩා ක්‍රියාවක් ගන්න.',
      'ගැඹුරු විශ්වාසයෙන් සහ අවධානයෙන් ඔබේ දවස ජීවත්වන්න.',
      'මෙම ගමනෙන් ලැබුණු අර්ථය සහ ආලෝකය සන්සුන්ව තබාගන්න.'
    ]
  } as const;

  return descriptions[goal][phase];
}

function getLocalizedGoalAffirmation(goal: 'health' | 'love' | 'career' | 'education' | 'peace' | 'spiritual', day: number): string {
  const phase = getLocalizedPhaseIndex(day);
  const affirmations = {
    health: [
      'මම මගේ ශරීරයට ආදරයෙන් සවන් දෙමි.',
      'සුව ශක්තිය මා තුළ මෘදු ලෙස ජීවමාන වේ.',
      'මම මගේ ශරීරයට උදව් වන තේරීම් හඳුනාගනිමි.',
      'කුඩා සුවදායී පියවර මාව හොඳටම ගෙනයයි.',
      'මම සුවපත් පුද්ගලයෙකු ලෙස ජීවත් වෙමි.',
      'මගේ සුව ගමන ඉදිරියටත් ආදරයෙන් തുടരෙයි.'
    ],
    love: [
      'මම ආදරය ලබන්නත් දෙන්නත් සුදුසුය.',
      'දැනටමත් මගේ ජීවිතයේ ඇති ආදරය මම අගය කරමි.',
      'මම මගේ හදවතට ගරු කරමි.',
      'මෘදු සත්‍ය ක්‍රියා ආදරයට ඉඩ දෙයි.',
      'මම සෞඛ්‍ය සම්පන්න ආදරය තෝරමි.',
      'මගේ හදවත දැන් වඩාත් විවෘත හා සන්සුන්ය.'
    ],
    career: [
      'මගේ හැකියාවන්ට වටිනාකමක් ඇත.',
      'අවස්ථා මම සන්සුන්ව හඳුනාගනිමි.',
      'මම මගේ මාර්ගය පැහැදිලි කරගනිමි.',
      'කුඩා සැබෑ පියවර මගේ දියුණුව ගොඩනගයි.',
      'මම විශ්වාසයෙන් වැඩ කරන පුද්ගලයෙකි.',
      'මගේ ඊළඟ පියවර සඳහා මම සූදානම්ය.'
    ],
    education: [
      'මගේ මනස ඉගෙනීමට විවෘතය.',
      'දැනුම මගේ ජීවිතය මෘදු ලෙස පුළුල් කරයි.',
      'මම අවධානයට සුදුසු පරිසරයක් මවමි.',
      'අද කරන කුඩා ඉගෙනීමත් අගනාය.',
      'මම පුරුද්දෙන් වර්ධනය වන ශිෂ්‍යයෙකි.',
      'මගේ ඉගෙනුම් ගමන මට විශ්වාසය දෙයි.'
    ],
    peace: [
      'සාමය මගේ හුස්ම සමඟ නැවත එයි.',
      'මම දැනටමත් ඇති සන්සුන් බව හඳුනාගනිමි.',
      'මට නොගැලපෙන බර මම ලිහිල් කරමි.',
      'කුඩා සන්සුන් පියවර මට ලොකු ආසවක් දෙයි.',
      'මම මෘදු සහ නිශ්චල ශක්තියක් රැගෙන යමි.',
      'මගේ අභ්‍යන්තර සාමය මට මග පෙන්වයි.'
    ],
    spiritual: [
      'මම මගේ අභ්‍යන්තර හඬට සවන් දෙමි.',
      'ජීවිතය මට මෘදු සංඥා යවයි.',
      'මම විශ්වාසය තෝරා නිදහස් වෙමි.',
      'මගේ හැඟීම සහ ක්‍රියාව එකට ගලා යයි.',
      'මම අවධානයෙන් සහ අර්ථයෙන් ජීවත් වෙමි.',
      'මගේ ආත්මික වර්ධනය ඉදිරියටත් විවෘතව පවතී.'
    ]
  } as const;

  return affirmations[goal][phase];
}

const HEALTH_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් සන්සුන්ව හුස්ම ගෙන ඔබේ ශරීරයට ආදරයෙන් සවන් දෙන්න.' },
    { type: 'gratitude', text: 'අද ඔබේ ශරීරය ඔබට කර දෙන කරුණු 3ක් මතකයට ගන්න.' },
    { type: 'action', text: 'වතුර වීදුරුවක් මෘදුව පානය කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම සුවයට විවෘතයි" යැයි මෘදුව 5 වතාවක් කියන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 තුළ ඔබට අවශ්‍ය සුව හැඟීමක් වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබේ ඇඳ හෝ විවේක ගන්නා තැන ටිකක් පිළිවෙලට සකසන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අතක් හදවත මත තබා විනාඩි 2ක් සෙමින් හුස්ම ගන්න.' },
    { type: 'journaling', text: 'ඔබේ ශරීරයට අද අවශ්‍ය දේ එකක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 5ක් මෘදු ලෙස ඇදගෙන හෝ ඇවිදින්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට සුවයක් දෙන කුඩා දේ 3ක් ලියන්න.' },
    { type: 'vibration', text: 'ඔබ සන්සුන්ව හා ශක්තිමත්ව සිටින රූපයක් මනසින් දකින්න.' },
    { type: 'action', text: 'අද පෝෂණය දෙන සරල ආහාරයක් තෝරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ ශරීරයේ ආතතිය ඇති තැනක් හඳුනාගෙන එය මෘදුව ලිහිල් කරන්න.' },
    { type: 'gratitude', text: 'ඔබේ නින්ද, ආහාර හෝ විවේකයට උදව් වන කරුණක් අගය කරන්න.' },
    { type: 'action', text: 'ඔබේ වතුර බෝතලය හෝ පානය කරන තැනක් පිළිවෙලට තබන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ ශරීරය මගේ මිතුරා" යැයි සන්සුන්ව කියන්න.' },
    { type: 'journaling', text: 'ඔබට සුවය දෙන දෛනික පුරුද්දක් එකක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් දුරකථනයෙන් ඉවත් වී ශරීරයට නිදහස් ඉඩක් දෙන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ සෞඛ්‍යය සම්බන්ධයෙන් දැනටමත් හොඳට යන කරුණක් ලියන්න.' },
    { type: 'mindfulness', text: 'හුස්ම ගනිමින් "සුවය ඇතුළට, ආතතිය පිටට" යැයි සිතින් කියන්න.' },
    { type: 'action', text: 'විනාඩි 5ක් ආලෝකය හෝ පිරිසිදු වාතය ලබාගන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබේ ශරීරයේ ශක්තිමත් පැත්තක් 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'ඔබට බලය අඩු කරන එක සිතුවිල්ලක් හඳුනාගන්න.' },
    { type: 'action', text: 'අද විවේකයට උදව් වන කුඩා වෙනසක් කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම සුවයට සුදුසුය" යැයි විශ්වාසයෙන් කියන්න.' },
    { type: 'journaling', text: 'ඔබට ආතතිය වැඩි කරන රටාවක් එකක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ බෑගය, මේසය හෝ කාමරයේ කුඩා කොටසක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඇස් පියා ඔබේ ශරීරයට සන්සුන් බව පිරෙන ලෙස දැනගන්න.' },
    { type: 'gratitude', text: 'අද ඔබට ලැබුණු ශක්තියේ මොහොතක් මතකයට ගන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් මෘදු වීඩියෝවක් හෝ සුවය දෙන උපදෙසක් බලන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබේ සුව ගමනට බාධා කරන පැරණි විශ්වාසයක් ලියන්න.' },
    { type: 'vibration', text: 'එම විශ්වාසය වෙනුවට ආදරණීය නව වාක්‍යයක් තෝරන්න.' },
    { type: 'action', text: 'ඔබේ ශරීරයට උදව් වන සරල දෙයක් අද තෝරා කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබේ ශරීරයට කාරුණික වීමට නියමයක් සිතින් තබන්න.' },
    { type: 'journaling', text: 'අද ඔබට කරන්න පුළුවන් සුවදායී පියවරක් එකක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් සරල ඇවිදීමක් හෝ ඇදීමක් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'පෝෂණය, විවේකය හෝ පිරිසිදුකම ගැන ඔබට උදව් වන දෙයක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ සෞඛ්‍යවන්ත ලෙස දවස ගත කරන අයුර මනසින් දකින්න.' },
    { type: 'action', text: 'අද අමතර එකක් වෙනුවට සරල සුවදායී තේරීමක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් ආහාර හෝ පානයකට පෙර නතර වී කෘතවේදී වන්න.' },
    { type: 'journaling', text: 'ඔබේ ශරීරය හොඳටම හැඟෙන වෙලාවන් මොනවාද කියා ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ නින්දට උදව් වන කුඩා සූදානමක් කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම මගේ සුවයට සහය දෙනවා" යැයි මෘදුව කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ සුවය වෙනුවෙන් මෙතෙක් කළ කුඩා පියවරක් අගය කරන්න.' },
    { type: 'action', text: 'ඔබේ සෞඛ්‍ය සම්බන්ධ එක සටහනක් හෝ මතක් කිරීමක් පිළිවෙලට තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබව සුවපත් පුද්ගලයෙකු ලෙස මනසින් හඳුනාගන්න.' },
    { type: 'vibration', text: 'ඔබ ශරීරයට ගරු කරමින් දවස ගත කරන රූපය බලන්න.' },
    { type: 'action', text: 'අද විවේකයට හෝ සුවයට නිශ්චිත කුඩා වෙලාවක් වෙන් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ ශරීරයේ ප්‍රගතියක් හෝ සැහැල්ලුවක් එකක් අගය කරන්න.' },
    { type: 'journaling', text: 'සුවදායී දෛනික අනන්‍යතාවයක් ගැන වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ ඉරියව්ව හෝ ඇවිදීම මෘදුව සවිස්තරව හදාගන්න.' }
  ],
  [
    { type: 'vibration', text: '"සුවය මගේ දෛනික තේරීමකි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඔබ තුළ ඇති සන්සුන් ශක්තිය දැනගන්න.' },
    { type: 'action', text: 'ඔබට හොඳ පුරුද්දක් මතක් කරන කුඩා සටහනක් තබන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනේ ඔබට වෙනස් වී ඇති කරුණු 3ක් ලියන්න.' },
    { type: 'journaling', text: 'සුවය ගැන ඔබ දැන් විශ්වාස කරන නව වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද විවේකයට හෝ මෘදු චලනයට කුඩා වෙලාවක් නැවත දෙන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ ශරීරයට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගය අවසන් වූ පසුවත් ඔබ මේ සුවය ගෙනයන අයුර දකින්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න සරල සුව පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දින 21 තුළ ඔබ ලබාගත් අභ්‍යන්තර ශක්තිය අගය කරන්න.' },
    { type: 'journaling', text: 'ඉදිරියටත් ඔබට රැගෙන යාමට අවශ්‍ය සුව පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබ වෙනුවෙන් ඉතා මෘදු සතුටුදායී දෙයක් කරන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

const LOVE_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'අතක් හදවත මත තබා විනාඩි 2ක් සෙමින් හුස්ම ගන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 සඳහා ඔබේ සම්බන්ධතා ගැන ආදරණීය නියමයක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ අවට කුඩා ඉඩක් උණුසුම්ව හා පිළිවෙලට සකසන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම ආදරයට විවෘතයි" යැයි මෘදුව කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ ජීවිතයේ දැනටමත් ඇති ආදරය හෝ සහාය 3ක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබටම කාරුණික වචනයක් ලියා තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබට ආදරය කියන්නේ කුමන හැඟීමක්ද යන්න විනාඩි 2ක් දැනගන්න.' },
    { type: 'journaling', text: 'ඔබට අවශ්‍ය සම්බන්ධතාවයක ගුණ 3ක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ පෙනුම හෝ ශක්තියට මෘදු සැලකිල්ලක් දෙන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට කවදා හෝ ලැබුණු ආදරණීය මොහොතක් මතකයට ගන්න.' },
    { type: 'vibration', text: 'ඔබ ආදරයෙන් සම්බන්ධ වන්නේ කෙසේදැයි මනසින් දකින්න.' },
    { type: 'action', text: 'ඔබ අගය කරන කෙනෙකුට උණුසුම් පණිවිඩයක් යවන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ හදවත වසා දමන එක බියක් හඳුනාගන්න.' },
    { type: 'gratitude', text: 'ඔබේම හොඳ ගුණ 3ක් අගය කරන්න.' },
    { type: 'action', text: 'ඔබට සතුටුදායී ගීතයක් හෝ මෘදු මොහොතක් දෙන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ හදවතට ගරු කරන ආදරය මම තෝරමි" යැයි කියන්න.' },
    { type: 'journaling', text: 'සම්බන්ධතාවයක ඔබට වැදගත් සීමාවක් එකක් ලියන්න.' },
    { type: 'action', text: 'අද එක් සංවාදයකදී ඉතා සාවධානව සවන් දෙන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ ජීවිතයේ උණුසුම වැඩි කරන කෙනෙකු හෝ දෙයක් අගය කරන්න.' },
    { type: 'mindfulness', text: 'හුස්ම සමඟ ඔබේ හදවත මෘදු වන බව දැනගන්න.' },
    { type: 'action', text: 'ඔබේ කාමරයේ හෝ මේසයේ කුඩා කොටසක් සන්සුන්ව සකසන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ සම්බන්ධතාවයකට ගෙන එන ශක්තිමත් ගුණ 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'ආදරය ගැන පරණ රිදීමක් හෝ සැකයක් එකක් හඳුනාගන්න.' },
    { type: 'action', text: 'අද ඔබටම ආදරණීය විවේක මොහොතක් දෙන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම සෞඛ්‍ය සම්පන්න ආදරයට සුදුසුය" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබට අකමැති සම්බන්ධතා රටාවක් එකක් ලියන්න.' },
    { type: 'action', text: 'අද එක් අවස්ථාවකදී ඔබේ සත්‍ය හැඟීම මෘදුව ප්‍රකාශ කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඔබේ හදවතේ සැහැල්ලුවක් දැනගන්න.' },
    { type: 'gratitude', text: 'ඔබට සුරක්ෂිත බව දෙන කෙනෙකු හෝ ස්ථානයක් අගය කරන්න.' },
    { type: 'action', text: 'අද අමනාප වචන වෙනුවට මෘදු වචනයක් තෝරන්න.' }
  ],
  [
    { type: 'journaling', text: 'ආදරය ගැන ඔබට දැන් අත්හැරීමට අවශ්‍ය විශ්වාසයක් ලියන්න.' },
    { type: 'vibration', text: 'එයට වෙනුවට නව ආදරණීය විශ්වාසයක් තෝරන්න.' },
    { type: 'action', text: 'ඔබට ආදරය මතක් කරන කුඩා සංකේතයක් අසල තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබේ සම්බන්ධතා සඳහා හොඳ නියමයක් සිතින් තබන්න.' },
    { type: 'journaling', text: 'අද ඔබට ගත හැකි කුඩා ආදරණීය පියවරක් ලියන්න.' },
    { type: 'action', text: 'අද එක් පණිවිඩයක් හෝ කතාබහක් උණුසුම්ව ආරම්භ කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'අද ඔබට ලැබුණු කුඩා කරුණාවක් අගය කරන්න.' },
    { type: 'vibration', text: 'සන්සුන් හා ගරුක සම්බන්ධතාවයක ඔබ සිටින රූපය බලන්න.' },
    { type: 'action', text: 'අද එක් පුද්ගලයෙකුට අවංක ලෙස ස්තූතියි කියන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'සංවාදයට පෙර විනාඩියක් නතර වී හුස්ම ගන්න.' },
    { type: 'journaling', text: 'ඔබේ ආදර ජීවිතයේ ඉදිරිපසට ගෙන යාමට අවශ්‍ය ගුණයක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ සම්බන්ධතා හෝ පණිවිඩ පිළිවෙලට කරගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම මෘදු බව සහ සත්‍යය එකට ගෙන යමි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබ තුළ මේ දිනවල වර්ධනය වූ ආදරණීය ගුණයක් අගය කරන්න.' },
    { type: 'action', text: 'අද ඔබටම ආදරයෙන් සැලකෙන කුඩා තේරීමක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබ ආදරයට සුදුසු පුද්ගලයෙකු ලෙස අද ඔබව දැනගන්න.' },
    { type: 'vibration', text: 'ඔබ ගරු කරන සහ ගරු ලබන රූපයක් මනසින් දකින්න.' },
    { type: 'action', text: 'ඔබේ පෙනුම හෝ ඉරියව්ව විශ්වාසයෙන් මෘදුව හදාගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ හදවත දැන් වඩාත් විවෘත වූ කරුණක් අගය කරන්න.' },
    { type: 'journaling', text: 'සෞඛ්‍ය සම්පන්න ආදරය තෝරන ඔබ ගැන වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද සංවාදයකදී ඔබේ සීමාවක් පැහැදිලිව මෘදුව කියන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම ආදරය ගෙන යන පුද්ගලයෙකි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් හදවතේ සන්සුන් බව තබාගන්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න එක් ආදරණීය සම්බන්ධතා පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනේ ඔබට පැහැදිලි වූ කරුණු 3ක් ලියන්න.' },
    { type: 'journaling', text: 'ආදරය ගැන ඔබ දැන් විශ්වාස කරන නව සත්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද උණුසුම ගෙනෙන කුඩා සැබෑ ක්‍රියාවක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ හදවතට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගයෙන් පසුත් ආදරය මෘදුව ගලා යන අයුර දකින්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න එක් ආදරණීය සම්බන්ධතා පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දින 21 තුළ ඔබ ලැබූ අභ්‍යන්තර වර්ධනය අගය කරන්න.' },
    { type: 'journaling', text: 'ඔබේ සම්බන්ධතා සඳහා ඉදිරි පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබටත් වෙනත් කෙනෙකුටත් මෘදු කරුණාවක් දෙන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

LOA_CONTENT.health.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('health', i + 1),
  affirmation: getLocalizedGoalAffirmation('health', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, HEALTH_TASKS_SI)
}));

LOA_CONTENT.love.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('love', i + 1),
  affirmation: getLocalizedGoalAffirmation('love', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, LOVE_TASKS_SI)
}));

const CAREER_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් සන්සුන්ව හුස්ම ගෙන ඔබේ වෘත්තීය අනාගතයට මනස විවෘත කරන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 සඳහා ඔබේ වෘත්තීය නියමය වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබේ මේසය, ලැප්ටොප් එක හෝ වැඩ තැනේ කුඩා කොටසක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ හැකියාවන්ට වටිනාකමක් ඇත" යැයි කියන්න.' },
    { type: 'gratitude', text: 'දැනටමත් ඔබ සතුව ඇති වෘත්තීය ආශීර්වාද 3ක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ වැඩ ජීවිතයට උදව් වන එක් දේ පිරිසිදුව සකසන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබට වැඩ ගැන අවශ්‍ය හැඟීම කුමක්දැයි විනාඩි 2ක් දැනගන්න.' },
    { type: 'journaling', text: 'ඔබට අවශ්‍ය වෘත්තීය දිශාව ගැන කුඩා පැහැදිලි වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ පෙනුම හෝ ඉරියව්ව ටිකක් විශ්වාසයෙන් හදාගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට මෙතෙක් උපකාර කළ එක වෘත්තීය අවස්ථාවක් අගය කරන්න.' },
    { type: 'vibration', text: 'සන්සුන්ව වැඩ කර සාර්ථක වන ඔබව මනසින් දකින්න.' },
    { type: 'action', text: 'ඔබේ කුසලතාවයක් ලැයිස්තුගත කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ වටිනාකම අඩු කරන සිතුවිල්ලක් හඳුනාගන්න.' },
    { type: 'gratitude', text: 'ඔබ හොඳින් කරන වැඩ 3ක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් ඔබේ ක්ෂේත්‍රයට සම්බන්ධ දෙයක් කියවන්න හෝ බලන්න.' }
  ],
  [
    { type: 'vibration', text: '"මට ගැලපෙන අවස්ථා මට පෙනේ" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබට සහාය විය හැකි එක් කුසලතාවක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ රෙසුමේ, සටහන් හෝ වැඩ ලැයිස්තුවක් ටිකක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට ඉගෙන ගැනීමට ලැබුණු වෘත්තීය පාඩමක් අගය කරන්න.' },
    { type: 'mindfulness', text: 'හුස්ම සමඟ "මම සන්සුන්ව දියුණුව තෝරමි" යැයි සිතින් කියන්න.' },
    { type: 'action', text: 'අද එක් අදහසක් හෝ වැඩ සටහනක් ලියන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබේ ශක්තිමත් කුසලතා 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'ඔබව නවත්වන පුරුද්දක් හඳුනාගන්න.' },
    { type: 'action', text: 'අද විනාඩි 10ක් අවධානයෙන් ඉගෙනීමකට වෙන් කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ වැඩට වටිනා ප්‍රතිඵල තිබේ" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබට උනන්දු විය හැකි කුඩා අදහසක් ලියන්න.' },
    { type: 'action', text: 'ඔබගේ කුසලතාවයක් කෙනෙකුට උදව් විය හැකි ආකාරයක් සටහන් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබට බිය ඇති කරන වෘත්තීය සිතුවිල්ලකට මෘදු ඉඩක් දෙන්න.' },
    { type: 'gratitude', text: 'ඔබේ මෙතෙක් කළ කුඩා ප්‍රගතියක් අගය කරන්න.' },
    { type: 'action', text: 'අද එක් අනවශ්‍ය අවුලක් හෝ අවධානය බිඳින දෙයක් ඉවත් කරන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ අත්හැරීමට කැමති වෘත්තීය සීමාවක් ලියන්න.' },
    { type: 'vibration', text: 'එයට වෙනුවට නව විශ්වාසයක් තෝරා කියන්න.' },
    { type: 'action', text: 'ඔබට ගැලපෙන අවස්ථාවක් ගැන විනාඩි 10ක් සොයා බලන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබේ වැඩ දිශාවට සන්සුන් නියමයක් තබන්න.' },
    { type: 'journaling', text: 'අද ඔබට ගත හැකි කුඩා වෘත්තීය පියවරක් ලියන්න.' },
    { type: 'action', text: 'එක් පණිවිඩයක්, විමසීමක් හෝ සටහනක් යවන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට දැනටමත් විවෘතව ඇති අවස්ථාවක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ විශ්වාසයෙන් කතා කරන රූපයක් මනසින් දකින්න.' },
    { type: 'action', text: 'විනාඩි 10ක් ඔබේ කුසලතාවයක් වැඩි කරන දෙයක් ඉගෙන ගන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'වෘත්තීය ක්‍රියාවට පෙර විනාඩියක් හුස්ම ගෙන සන්සුන් වන්න.' },
    { type: 'journaling', text: 'ඔබේ ඊළඟ කුඩා ඉලක්කය වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබේ ලේඛන, ෆෝල්ඩරයක් හෝ සටහන් ටිකක් පිළිවෙලට කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම දියුණුව සහ වගකීම එකට ගෙන යමි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ වැඩ ගැන දැන් ඇති පැහැදිලි බව අගය කරන්න.' },
    { type: 'action', text: 'ඔබේ අදහසක් හෝ කුසලතාවයක් සටහන් කර තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබ සාර්ථක පුද්ගලයෙකු ලෙස මනසින් දැනගන්න.' },
    { type: 'vibration', text: 'ඔබේ අනාගත ස්වයංරූපය සන්සුන්ව දකින්න.' },
    { type: 'action', text: 'අද ඔබේ දවසේ කුඩා එක වැඩක් අවසන් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ විශ්වාසය වැඩි වූ කරුණක් අගය කරන්න.' },
    { type: 'journaling', text: 'දියුණු වන ඔබ ගැන නව වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ ඉරියව්ව හෝ කතාව ටිකක් විශ්වාසයෙන් තබාගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ කුඩා පියවර මගේ අනාගතය ගොඩනගයි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඔබ තුළ ඇති ශක්තිය දැනගන්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න වෘත්තීය පුරුද්දක් එකක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දිනවල ඔබ දියුණු වූ අංග 3ක් ලියන්න.' },
    { type: 'journaling', text: 'ඔබේ ඊළඟ සන්සුන් පියවර කුමක්දැයි ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ වැඩ දියුණුවට කුඩා සටහනක් හෝ සැලසුමක් තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ හැකියාවන්ට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගයෙන් පසුවත් ඔබ සන්සුන්ව ඉදිරියට යන රූපය දකින්න.' },
    { type: 'action', text: 'ඉදිරියට පවත්වාගෙන යාමට එක් සැබෑ ක්‍රියාවක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනෙන් ලැබුණු අභ්‍යන්තර වර්ධනය අගය කරන්න.' },
    { type: 'journaling', text: 'ඔබේ වෘත්තීය ජීවිතයට ඉදිරියටත් තබාගන්න පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ උත්සාහයට ගරු කරමින් කුඩා විවේකයක් දෙන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

const EDUCATION_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් හුස්ම ගෙන මනස ඉගෙනීමට මෘදුව විවෘත කරන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 තුළ ඔබ ඉගෙනීමට කැමති දෙයක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ පොත්, සටහන් හෝ ඉගෙනුම් තැනේ කුඩා කොටසක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ මනස විවෘතයි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'දැනටමත් ඔබ දන්නා වටිනා කරුණු 3ක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් සරලව කියවන්න හෝ පාඩමක් බලන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබ ඉගෙනීමට කැමති හැඟීම කුමක්දැයි දැනගන්න.' },
    { type: 'journaling', text: 'ඔබේ ඉගෙනුම් අරමුණ වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ලියන පෑනක්, පොතක් හෝ ඉගෙනුම් යෙදුමක් සූදානම් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට ඉගෙනීමට උදව් වන සම්පත් 3ක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ සන්සුන්ව අවධානයෙන් ඉගෙන ගන්නා අයුර දකින්න.' },
    { type: 'action', text: 'අද එක් කුඩා සටහනක් සකස් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අවධානය බිඳින එක පුරුද්දක් හඳුනාගන්න.' },
    { type: 'gratitude', text: 'ඔබේ මතකයට හෝ කුතුහලයට අද ස්තූතියි කියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් දුරකථනයෙන් ඉවත් වී ඉගෙනීමකට වෙලාවක් දෙන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම සන්සුන්ව ඉගෙන ගනිමි" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබේ ශක්තිමත් ඉගෙනුම් ගුණ 3ක් ලියන්න.' },
    { type: 'action', text: 'අද පාඩමක වැදගත් අදහසක් එකක් සටහන් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙතෙක් ඔබ ඉගෙන ගත් වටිනා පාඩමක් අගය කරන්න.' },
    { type: 'mindfulness', text: 'හුස්ම සමඟ මනසේ අවුල අඩුවන බව දැනගන්න.' },
    { type: 'action', text: 'ඔබේ ඉගෙනුම් තැන ටිකක් සන්සුන්ව සකසන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ හොඳින් තේරුම් ගන්නා විෂයයක් හෝ කුසලතාවයක් ලියන්න.' },
    { type: 'mindfulness', text: 'ඔබට අමාරු යැයි කියාගන්න සිතුවිල්ලක් හඳුනාගන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් එම විෂයයට නැවත මෘදුව බලන්න.' }
  ],
  [
    { type: 'vibration', text: '"දැනුම මට පහසුවෙන් පැමිණේ" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබේ ඉගෙනුමට බාධා කරන රටාවක් ලියන්න.' },
    { type: 'action', text: 'ඔබට උපකාරී පාඩම් වීඩියෝවක් හෝ ලිපියක් සුරකින්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඔබට පැහැදිලි බව පිරෙන බව දැනගන්න.' },
    { type: 'gratitude', text: 'ඔබේ උත්සාහය ගැන ඔබටම ස්තූතියි කියන්න.' },
    { type: 'action', text: 'අද කුඩා සාරාංශයක් ලියන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ අත්හැරීමට කැමති ඉගෙනුම් බියක් ලියන්න.' },
    { type: 'vibration', text: 'එයට වෙනුවට "මම ඉගෙන ගනිමින් වැඩෙමි" යැයි කියන්න.' },
    { type: 'action', text: 'ඔබට අමාරු කොටසකට විනාඩි 10ක් මෘදුව වෙලාවක් දෙන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඉගෙනීමට පෙර සන්සුන් නියමයක් තබන්න.' },
    { type: 'journaling', text: 'අද ඉගෙන ගත හැකි කුඩා දෙයක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10 සිට 15 දක්වා අවධානයෙන් ඉගෙන ගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට උදව් වන ගුරුවරයෙකු, පොතක් හෝ සම්පතක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ තේරුම් ගෙන නිදහසේ ලියන රූපය බලන්න.' },
    { type: 'action', text: 'අද ඉගෙනීමෙන් ලැබුණු අදහසක් කෙටිව සටහන් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඉගෙනීමට පෙර දුරකථනය මිනිත්තු කිහිපයකට අසලින් ඉවත් කරන්න.' },
    { type: 'journaling', text: 'ඔබට තවත් පැහැදිලි කරන්න අවශ්‍ය කරුණක් ලියන්න.' },
    { type: 'action', text: 'එක් කුඩා ප්‍රශ්නයකට පිළිතුරක් සොයා බලන්න.' }
  ],
  [
    { type: 'vibration', text: '"කුඩා පියවරත් මගේ දැනුම වැඩි කරයි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ අවධානය ගැන අද අගය කරන්න.' },
    { type: 'action', text: 'ඔබේ සටහන් හෝ ෆෝල්ඩරයක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබ ඉගෙන ගන්නා පුද්ගලයෙකු ලෙස ඔබවම දැනගන්න.' },
    { type: 'vibration', text: 'අවධානයෙන් පිරුණු අනාගත ඔබව මනසින් දකින්න.' },
    { type: 'action', text: 'ඔබට හොඳ ඉගෙනුම් වෙලාවක් කුඩා ලෙස වෙන් කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ විශ්වාසය වැඩි වූ ඉගෙනුම් කරුණක් අගය කරන්න.' },
    { type: 'journaling', text: 'දියුණු වන ශිෂ්‍යයෙකු ලෙස ඔබ ගැන වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඉගෙනීමෙන් ලැබුණු එක අදහසක් කෙනෙකුට කියන්න හෝ ලියා තබන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම පුරුද්දෙන් වර්ධනය වෙමි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් මනසේ සැහැල්ලුව දැනගන්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න ඉගෙනුම් පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනේ ඔබ ඉගෙන ගත් දේ 3ක් ලියන්න.' },
    { type: 'journaling', text: 'දැනුම ගැන ඔබ දැන් විශ්වාස කරන නව වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද කුඩා පද්ධතියක් හෝ මතක් කිරීමක් සකසන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ මනසට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගයෙන් පසුවත් ඔබ ඉගෙනීම දිගටම කරගෙන යන අයුර දකින්න.' },
    { type: 'action', text: 'ඊළඟ දිනවල කියවීමට හෝ ඉගෙනීමට කුඩා දෙයක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දින 21 තුළ ලැබුණු අභ්‍යන්තර වර්ධනය අගය කරන්න.' },
    { type: 'journaling', text: 'ඔබේ ඉගෙනුම් ගමනට ඉදිරියටත් පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ උත්සාහයට ගරු කරමින් මෘදු විවේකයක් දෙන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

LOA_CONTENT.career.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('career', i + 1),
  affirmation: getLocalizedGoalAffirmation('career', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, CAREER_TASKS_SI)
}));

LOA_CONTENT.education.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('education', i + 1),
  affirmation: getLocalizedGoalAffirmation('education', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, EDUCATION_TASKS_SI)
}));

const PEACE_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් හුස්ම ගෙන ඔබේ මනසට නිහඬ ඉඩක් දෙන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 තුළ ඔබට අවශ්‍ය සාම හැඟීම වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබේ අවට කුඩා කොටසක් නිහඬව පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'vibration', text: '"සාමය මට ලබාගත හැක" යැයි මෘදුව කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ දවසේ සන්සුන් මොහොතක් 3ක් මතකයට ගන්න.' },
    { type: 'action', text: 'අද විනාඩි 5ක් නිහඬව දුරකථනයෙන් ඉවත් වන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ ශරීරයේ ආතතිය ඇති තැනක් හඳුනාගන්න.' },
    { type: 'journaling', text: 'ඔබේ මනසට අද අවශ්‍ය සහනය කුමක්දැයි ලියන්න.' },
    { type: 'action', text: 'ඔබේ ඇඳ හෝ විවේක තැන ටිකක් සකසන්න.' }
  ],
  [
    { type: 'gratitude', text: 'දැනටමත් ඔබේ ජීවිතයේ ඇති සන්සුන් කරුණු 3ක් ලියන්න.' },
    { type: 'vibration', text: 'ඔබ සන්සුන්ව දවස ගත කරන අයුර මනසින් දකින්න.' },
    { type: 'action', text: 'අද එක් ශබ්දවත් දෙයකින් ටිකක් ඈත් වන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ මනස කැළඹෙන එක රටාවක් හඳුනාගන්න.' },
    { type: 'gratitude', text: 'ඔබට සුරක්ෂිත බව දෙන ස්ථානයක් හෝ පුද්ගලයෙක් අගය කරන්න.' },
    { type: 'action', text: 'විනාඩි 5ක් සෙමින් ඇවිදිමින් වටපිටාව බලන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම මෘදුව සාමය තෝරමි" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබට අවශ්‍ය සීමාවක් එකක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ කාමරයේ හෝ මේසයේ සන්සුන් කොටසක් මවන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට සැහැල්ලුවක් දෙන දේ 3ක් අගය කරන්න.' },
    { type: 'mindfulness', text: 'හුස්ම සමඟ මනස ලිහිල් වන බව දැනගන්න.' },
    { type: 'action', text: 'අද ඔබේ ශබ්ද, තිර හෝ අවුල ටිකක් අඩු කරන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබේ අභ්‍යන්තර ශක්තිමත් පැති 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'ඔබට බරක් වන සිතුවිල්ලක් හඳුනාගන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් සන්සුන් සංගීතයක් හෝ නිහඬතාවයක් ලබාගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මට අතහැරිය හැක" යැයි මෘදුව කියන්න.' },
    { type: 'journaling', text: 'ඔබට අඩු කරගත හැකි මානසික බරක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ බෑගය හෝ මේසයේ කුඩා අවුලක් ඉවත් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් ඇස් පියා සන්සුන් රූපයක් මනසින් බලන්න.' },
    { type: 'gratitude', text: 'අද ඔබට ලැබුණු සැහැල්ලුවක් අගය කරන්න.' },
    { type: 'action', text: 'අද "නැහැ" කියා හැකි එක කුඩා දෙයක් තෝරන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ අත්හැරීමට කැමති මානසික රටාවක් ලියන්න.' },
    { type: 'vibration', text: 'එයට වෙනුවට "මම සන්සුන්ව සිටිය හැක" යැයි කියන්න.' },
    { type: 'action', text: 'අද විවේකයට කුඩා වෙලාවක් වෙන් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබේ දවස සඳහා සන්සුන් නියමයක් තබන්න.' },
    { type: 'journaling', text: 'අද ඔබට ගත හැකි සාමදායී පියවරක් ලියන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් සෙමින් ඇවිදින්න හෝ නිහඬව ඉඳින්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට සහනය දෙන පුරුද්දක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ නිශ්චලව හා මෘදුව කතා කරන අයුර දකින්න.' },
    { type: 'action', text: 'අද එක් සංවාදයක් ටිකක් මන්දගාමීව සහ අවධානයෙන් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'තිරයක් විවෘත කිරීමට පෙර හුස්මක් ගන්න.' },
    { type: 'journaling', text: 'ඔබේ සාමය රැකගන්න අවශ්‍ය සීමාවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ පරිසරයේ කුඩා නිහඬ මොහොතක් මවන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම සන්සුන් ශක්තියක් රැගෙන යමි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ මනස දැන් ටිකක් සැහැල්ලු වූ කරුණක් අගය කරන්න.' },
    { type: 'action', text: 'අද සවස ඔබට සැනසීම දෙන එක කුඩා දෙයක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබව සන්සුන් පුද්ගලයෙකු ලෙස මනසින් දැනගන්න.' },
    { type: 'vibration', text: 'නිදහස් හා සාමවත් ඔබව මනසින් දකින්න.' },
    { type: 'action', text: 'ඔබේ ඉරියව්ව හා හුස්ම ටිකක් සැහැල්ලුවෙන් තබාගන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ දවසේ සන්සුන් ප්‍රගතියක් අගය කරන්න.' },
    { type: 'journaling', text: 'සාමය තෝරන ඔබ ගැන වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද අනවශ්‍ය උත්තේජනයක් එකක් අඩු කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"සන්සුන් බව මගේ දෛනික පුරුද්දකි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් නිශ්චලව ඉඳිමින් හුස්ම නිරීක්ෂණය කරන්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න සාම පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනේ ඔබ දැක ඇති වෙනස්කම් 3ක් ලියන්න.' },
    { type: 'journaling', text: 'ඔබේ මනස ගැන දැන් විශ්වාස කරන නව වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබට සැනසීම දෙන කුඩා තේරීමක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ අභ්‍යන්තර සාමයට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගයෙන් පසුත් ඔබ සාමය රැගෙන යන අයුර දකින්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න එක් සන්සුන් සීමාවක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දින 21 තුළ ලැබුණු අභ්‍යන්තර සැහැල්ලුව අගය කරන්න.' },
    { type: 'journaling', text: 'ඔබේ සාම ගමනට ඉදිරියටත් පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබටම ඉතා මෘදු නිහඬ මොහොතක් තෑගි කරන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

const SPIRITUAL_TASKS_SI = [
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් නිහඬව ඉඳිමින් ඔබේ අභ්‍යන්තර හඬට ඉඩ දෙන්න.' },
    { type: 'journaling', text: 'මෙම දින 21 සඳහා ඔබේ ආත්මික නියමය වාක්‍යයකින් ලියන්න.' },
    { type: 'action', text: 'ඔබට නිහඬතාවය මතක් කරන කුඩා තැනක් සකසන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම මාර්ගදර්ශනයට විවෘතයි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබේ ජීවිතයේ ආශීර්වාද 3ක් මතකයට ගන්න.' },
    { type: 'action', text: 'අද විනාඩි 5ක් තනිව නිහඬව ඉන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබට දැනගන්න අවශ්‍ය හැඟීමක් හඳුනාගන්න.' },
    { type: 'journaling', text: 'ඔබට අර්ථය දෙන කරුණක් එකක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ දවස සන්සුන්ව ආරම්භ කිරීමට කුඩා සංකේතයක් තබන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට මෘදු මඟ පෙන්වීමක් ලැබුණු මොහොතක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ ආලෝකයෙන් සහ සන්සුන්ව යන රූපය දකින්න.' },
    { type: 'action', text: 'අද ඔබට අර්ථය දෙන වචනයක් හෝ සටහනක් ලියා තබන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබ තුළ ඇති සැකයක් හඳුනාගෙන එයට මෘදු ඉඩක් දෙන්න.' },
    { type: 'gratitude', text: 'ඔබේ අභ්‍යන්තර ශක්තියේ ලක්ෂණ 3ක් අගය කරන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් ආත්මික හෝ උද්දීපනීය දෙයක් කියවන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ ජීවිතයට අර්ථයක් ඇත" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබට මඟ පෙන්වන අගය එකක් ලියන්න.' },
    { type: 'action', text: 'අද පරිසරයේ ලස්සන දෙයක් අවධානයෙන් බලන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබව සන්සුන් කරන කුඩා සංඥා හෝ සුන්දරත්වයක් අගය කරන්න.' },
    { type: 'mindfulness', text: 'හුස්ම සමඟ විශ්වාසය ඇතුළට ගන්න, බර පිටට දමන්න.' },
    { type: 'action', text: 'අද දුරකථනයෙන් ටිකක් ඈත් වී නිහඬ වෙලාවක් ගන්න.' }
  ],
  [
    { type: 'journaling', text: 'ඔබ තුළ ඇති ආත්මික ශක්තිය 3ක් ලියන්න.' },
    { type: 'mindfulness', text: 'ඔබව අඳුරු කරන රටාවක් හඳුනාගන්න.' },
    { type: 'action', text: 'විනාඩි 10ක් සන්සුන්ව කියවන්න, යාච්ඤා කරන්න හෝ නිහඬව ඉන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම මගේ මග විශ්වාස කරමි" යැයි කියන්න.' },
    { type: 'journaling', text: 'ඔබ අත්හැරීමට කැමති ආත්මික බරක් ලියන්න.' },
    { type: 'action', text: 'ඔබට ශක්තිය දෙන වචනයක් කුඩා කඩදාසියක ලියන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'විනාඩි 2ක් නිහඬව ඉඳිමින් හදවතේ සැහැල්ලුව දැනගන්න.' },
    { type: 'gratitude', text: 'අද ලැබුණු කුඩා ආශීර්වාදයක් අගය කරන්න.' },
    { type: 'action', text: 'ඔබේ අවට ඇති සුන්දර දෙයක් සිතාසිට බලන්න.' }
  ],
  [
    { type: 'journaling', text: 'විශ්වාසයට බාධා කරන සිතුවිල්ලක් ලියන්න.' },
    { type: 'vibration', text: 'එයට වෙනුවට "ජීවිතය මට මෘදුව මඟ පෙන්වයි" යැයි කියන්න.' },
    { type: 'action', text: 'අද නිහඬතාවය සඳහා කුඩා වෙලාවක් කැප කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද දවස සඳහා ආත්මික නියමයක් තබන්න.' },
    { type: 'journaling', text: 'අද ඔබට ගත හැකි කුඩා සජීවී පියවරක් ලියන්න.' },
    { type: 'action', text: 'ඒ පියවර සන්සුන්ව කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබට මඟ පෙන්වන පුද්ගලයෙකු, පාඩමක් හෝ පොතක් අගය කරන්න.' },
    { type: 'vibration', text: 'ඔබ අර්ථයෙන් පිරුණු දවසක් ජීවත්වන අයුර දකින්න.' },
    { type: 'action', text: 'අද එක් උණුසුම් සත්‍ය ක්‍රියාවක් කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ක්‍රියාවකට පෙර හුස්මක් ගෙන හදවතට සවන් දෙන්න.' },
    { type: 'journaling', text: 'ඔබට දැන් ගත යුතු මෘදු පියවරක් ලියන්න.' },
    { type: 'action', text: 'ඔබේ සටහන්, පූජා තැන හෝ නිහඬ කොටසක් පිළිවෙලට ගන්න.' }
  ],
  [
    { type: 'vibration', text: '"මගේ ආත්මික හැඟීම සහ ක්‍රියාව එකට යයි" යැයි කියන්න.' },
    { type: 'gratitude', text: 'ඔබ තුළ ඇති පැහැදිලි බව අගය කරන්න.' },
    { type: 'action', text: 'අද එක් කුඩා කරුණාවක් නිහඬව කරන්න.' }
  ],
  [
    { type: 'mindfulness', text: 'අද ඔබ ආලෝකය රැගෙන යන පුද්ගලයෙකු ලෙස ඔබව දැනගන්න.' },
    { type: 'vibration', text: 'ඔබේ අනාගත ස්වයංරූපය සන්සුන්ව දකින්න.' },
    { type: 'action', text: 'අද ඔබේ දවස ටිකක් වැඩි අවධානයෙන් ගත කරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'ඔබේ අභ්‍යන්තර විශ්වාසය වැඩි වූ කරුණක් අගය කරන්න.' },
    { type: 'journaling', text: 'වර්ධනය වන ඔබ ගැන වාක්‍යයක් ලියන්න.' },
    { type: 'action', text: 'ඔබට අර්ථයක් දෙන කුඩා පුරුද්දක් නැවත කරන්න.' }
  ],
  [
    { type: 'vibration', text: '"මම අවධානයෙන් ජීවත් වෙමි" යැයි කියන්න.' },
    { type: 'mindfulness', text: 'විනාඩි 2ක් නිශ්චලව ඉඳිමින් ඔබේ හුස්ම නිරීක්ෂණය කරන්න.' },
    { type: 'action', text: 'ඉදිරියටත් තබාගන්න නිහඬ පුරුද්දක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම ගමනේ ලැබුණු අභ්‍යන්තර සංවේදන 3ක් ලියන්න.' },
    { type: 'journaling', text: 'ඔබ දැන් විශ්වාස කරන නව ආත්මික සත්‍යයක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ දවසේ එක මොහොතක් සම්පූර්ණයෙන්ම සජීවීව අත්විඳින්න.' }
  ],
  [
    { type: 'mindfulness', text: 'ඔබේ අභ්‍යන්තර ආලෝකයට "ස්තූතියි" යැයි සිතින් කියන්න.' },
    { type: 'vibration', text: 'අභියෝගයෙන් පසුවත් ඔබ විශ්වාසයෙන් ඉදිරියට යන අයුර දකින්න.' },
    { type: 'action', text: 'ඉදිරියට රැගෙන යන ආත්මික පුරුද්දක් එකක් තෝරන්න.' }
  ],
  [
    { type: 'gratitude', text: 'මෙම දින 21 තුළ ලැබුණු ආලෝකය සහ පැහැදිලි බව අගය කරන්න.' },
    { type: 'journaling', text: 'ඔබේ ආත්මික ගමනට ඉදිරියටත් පොරොන්දුවක් ලියන්න.' },
    { type: 'action', text: 'අද ඔබේ මනසට අර්ථවත් මෘදු මොහොතක් දෙන්න.' }
  ]
] as { type: LOASinhalaTaskType; text: string }[][];

LOA_CONTENT.peace.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('peace', i + 1),
  affirmation: getLocalizedGoalAffirmation('peace', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, PEACE_TASKS_SI)
}));

LOA_CONTENT.spiritual.days = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  title: `දිනය ${i + 1}`,
  miniDescription: getLocalizedGoalMiniDescription('spiritual', i + 1),
  affirmation: getLocalizedGoalAffirmation('spiritual', i + 1),
  tasks: buildLocalizedSpecificTasks(i + 1, SPIRITUAL_TASKS_SI)
}));
