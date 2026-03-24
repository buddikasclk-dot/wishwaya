import { LOACategoryContent } from '../types';

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

function getWealthDayTitle(day: number): string {
  const titles = [
    "සෞභාග්‍යයට ඉඩ සලසා ගැනීම", "කෘතඥතාවයේ බලය", "මුදල් ගැන ධනාත්මක දැක්ම", "ත්‍යාගශීලී බව", "අනාගතය දෘශ්‍යමාන කිරීම",
    "ණය බරින් නිදහස් වන හැඟීම", "ලැබීම් අගය කිරීම", "ධනවත් පුරුදු", "අවස්ථාවන් හඳුනා ගැනීම", "ස්වයං වටිනාකම",
    "මුදල් ගලා ඒම", "සාර්ථකත්වයේ සතුට", "බිය දුරු කිරීම", "විශ්වාසය ගොඩනැගීම", "අරමුණු ස්ථිර කිරීම",
    "ක්‍රියාත්මක වීම", "බාධා ජය ගැනීම", "පොහොසත් මනස", "ආයෝජනය සහ ඉතිරිය", "පූර්ණ තෘප්තිය", "විශ්වයට ස්තූති කිරීම"
  ];
  return titles[day - 1] || "සෞභාග්‍යයේ දිනයක්";
}

function getWealthDayDesc(day: number): string {
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

function getWealthAffirmation(day: number): string {
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
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
  return getGenericTasksForDay(day);
}
