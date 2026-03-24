
export interface OmenData {
  keywords: string[];
  prediction: string;
  context: string;
  remedy: string;
  status: 'positive' | 'neutral' | 'caution';
}

export const BIRTHMARK_OMENS: OmenData[] = [
  {
    keywords: ['නළල', 'nalala', 'forehead'],
    prediction: 'ඉතා වාසනාවන්තයි.',
    context: 'නළල මැද උපන් ලපයක් තිබීම උසස් තනතුරු සහ ගෞරවය ලැබීමට හේතු වේ.',
    remedy: 'නිතර ආගමික වතාවත්වල නිරත වන්න.',
    status: 'positive'
  },
  {
    keywords: ['දකුණු ඇස', 'dakunu asa', 'right eye'],
    prediction: 'ධන ලාභ ලැබේ.',
    context: 'දකුණු ඇස අසල උපන් ලපයක් තිබීම ව්‍යාපාරික සාර්ථකත්වය සහ ධනය ලැබීමට හේතු වේ.',
    remedy: 'දුප්පතුන්ට දන් දෙන්න.',
    status: 'positive'
  },
  {
    keywords: ['වම් ඇස', 'wam asa', 'left eye'],
    prediction: 'වියදම් අධික වේ.',
    context: 'වම් ඇස අසල උපන් ලපයක් තිබීම අනවශ්‍ය වියදම් සහ මානසික පීඩා ඇති කළ හැක.',
    remedy: 'මුදල් පාලනය ගැන සැලකිලිමත් වන්න.',
    status: 'caution'
  },
  {
    keywords: ['නාසය', 'nasaya', 'nose'],
    prediction: 'සංචාරයට ප්‍රියයි.',
    context: 'නාසය මත උපන් ලපයක් තිබීම නිතර සංචාරය කිරීමට සහ විදේශ ගත වීමට අවස්ථාව සලසයි.',
    remedy: 'සංචාරයේදී ප්‍රවේශම් වන්න.',
    status: 'positive'
  },
  {
    keywords: ['දකුණු කන', 'dakunu kana', 'right ear'],
    prediction: 'බුද්ධිමත් වේ.',
    context: 'දකුණු කනෙහි උපන් ලපයක් තිබීම ඉගෙනීමට දක්ෂ සහ බුද්ධිමත් අයෙකු බව පෙන්වයි.',
    remedy: 'දැනුම බෙදා දෙන්න.',
    status: 'positive'
  },
  {
    keywords: ['තොල්', 'thol', 'lips'],
    prediction: 'කථාවට දක්ෂයි.',
    context: 'තොල් මත උපන් ලපයක් තිබීම ප්‍රියමනාප කථාවට සහ ජනප්‍රිය වීමට හේතු වේ.',
    remedy: 'සත්‍යවාදී වන්න.',
    status: 'positive'
  },
  {
    keywords: ['දකුණු අත', 'dakunu atha', 'right hand'],
    prediction: 'කඩිසරයි.',
    context: 'දකුණු අතෙහි උපන් ලපයක් තිබීම ඕනෑම කාර්යයක් සාර්ථකව නිම කිරීමට ඇති හැකියාව පෙන්වයි.',
    remedy: 'අන් අයට උදව් කරන්න.',
    status: 'positive'
  },
  {
    keywords: ['වම් අත', 'wam atha', 'left hand'],
    prediction: 'කලාවට ලැදියි.',
    context: 'වම් අතෙහි උපන් ලපයක් තිබීම කලාත්මක හැකියාවන් සහ නිර්මාණශීලී බව පෙන්වයි.',
    remedy: 'කලා කටයුතුවල නිරත වන්න.',
    status: 'positive'
  },
  {
    keywords: ['බඩ', 'bada', 'stomach', 'abdomen'],
    prediction: 'සැපවත් ජීවිතයක්.',
    context: 'බඩ මත උපන් ලපයක් තිබීම ආහාර පානවලින් අඩුවක් නොමැති සැපවත් ජීවිතයක් ගත කිරීමට වාසනාව ඇති බව පෙන්වයි.',
    remedy: 'සෞඛ්‍ය සම්පන්න ආහාර රටාවක් අනුගමනය කරන්න.',
    status: 'positive'
  },
  {
    keywords: ['පිට', 'pitha', 'back'],
    prediction: 'වගකීම් අධික වේ.',
    context: 'පිටෙහි උපන් ලපයක් තිබීම ජීවිතයේ වැඩි වගකීම් ප්‍රමාණයක් දැරීමට සිදුවන බව පෙන්වයි.',
    remedy: 'ඉවසීමෙන් කටයුතු කරන්න.',
    status: 'neutral'
  }
];

export const LIZARD_OMENS: OmenData[] = [
  {
    keywords: ['හිස', 'hisa', 'head'],
    prediction: 'රාජ්‍ය ගෞරව ලැබේ.',
    context: 'හිස මත හූනෙකු වැටීම උසස් තනතුරු සහ ගෞරවය ලැබීමට හේතු වේ.',
    remedy: 'නිතර පිරිත් ශ්‍රවණය කරන්න.',
    status: 'positive'
  },
  {
    keywords: ['නළල', 'nalala', 'forehead'],
    prediction: 'බන්ධු දර්ශනය.',
    context: 'නළල මත හූනෙකු වැටීම නෑදෑ හිතමිතුරන් හමුවීමට අවස්ථාව සලසයි.',
    remedy: 'හිතවතුන්ට සංග්‍රහ කරන්න.',
    status: 'positive'
  },
  {
    keywords: ['දකුණු ඇස', 'dakunu asa', 'right eye'],
    prediction: 'සතුට ලැබේ.',
    context: 'දකුණු ඇස මත හූනෙකු වැටීම සිතට සතුට ගෙන දෙන පුවතක් ඇසීමට හේතු වේ.',
    remedy: 'සතුට බෙදා ගන්න.',
    status: 'positive'
  },
  {
    keywords: ['වම් ඇස', 'wam asa', 'left eye'],
    prediction: 'ධන හානි.',
    context: 'වම් ඇස මත හූනෙකු වැටීම අනපේක්ෂිත වියදම් ඇති වීමට හේතු විය හැක.',
    remedy: 'ප්‍රවේශම් වන්න.',
    status: 'caution'
  },
  {
    keywords: ['නාසය', 'nasaya', 'nose'],
    prediction: 'රෝගාබාධ.',
    context: 'නාසය මත හූනෙකු වැටීම සුළු අසනීප තත්ත්වයක් ඇති වීමට ඉඩ ඇති බව පෙන්වයි.',
    remedy: 'සෞඛ්‍යය ගැන සැලකිලිමත් වන්න.',
    status: 'caution'
  },
  {
    keywords: ['නිකට', 'nikata', 'chin'],
    prediction: 'රාජ දණ්ඩනය.',
    context: 'නිකට මත හූනෙකු වැටීම නීතිමය ගැටලුවලට හෝ දඬුවම්වලට ලක් වීමට ඉඩ ඇති බව පෙන්වයි.',
    remedy: 'නීතිගරුකව කටයුතු කරන්න.',
    status: 'caution'
  },
  {
    keywords: ['දකුණු උරහිස', 'dakunu urahisa', 'right shoulder'],
    prediction: 'සැප සම්පත් ලැබේ.',
    context: 'දකුණු උරහිස මත හූනෙකු වැටීම සැප පහසු ජීවිතයක් සහ ධනය ලැබීමට හේතු වේ.',
    remedy: 'පින්කම්වල නිරත වන්න.',
    status: 'positive'
  },
  {
    keywords: ['වම් උරහිස', 'wam urahisa', 'left shoulder'],
    prediction: 'ස්ත්‍රී ලාභ.',
    context: 'වම් උරහිස මත හූනෙකු වැටීම විවාහය හෝ ප්‍රියමනාප ස්ත්‍රීන් ඇසුරට අවස්ථාව සලසයි.',
    remedy: 'සදාචාරාත්මකව හැසිරෙන්න.',
    status: 'positive'
  },
  {
    keywords: ['දකුණු අත', 'dakunu atha', 'right arm'],
    prediction: 'ධන හානි.',
    context: 'දකුණු අත මත හූනෙකු වැටීම අනපේක්ෂිත වියදම් හෝ මුදල් නැති වීමට හේතු විය හැක.',
    remedy: 'මුදල් පරිහරණයේදී සැලකිලිමත් වන්න.',
    status: 'caution'
  },
  {
    keywords: ['වම් අත', 'wam atha', 'left arm'],
    prediction: 'කීර්තිය ලැබේ.',
    context: 'වම් අත මත හූනෙකු වැටීම සමාජයේ ගෞරවය සහ ප්‍රසිද්ධිය ලැබීමට හේතු වේ.',
    remedy: 'යහපත් ක්‍රියාවල නිරත වන්න.',
    status: 'positive'
  },
  {
    keywords: ['පපුව', 'papuwa', 'chest'],
    prediction: 'සතුට ලැබේ.',
    context: 'පපුව මත හූනෙකු වැටීම සිතට සතුට සහ සහනය ගෙන දෙන පුවතක් ඇසීමට හේතු වේ.',
    remedy: 'සතුට බෙදා ගන්න.',
    status: 'positive'
  },
  {
    keywords: ['යටි පතුල', 'yati pathula', 'sole'],
    prediction: 'ගමන් බිමන්.',
    context: 'යටි පතුල මත හූනෙකු වැටීම දුර බැහැර ගමන් හෝ විදේශ ගත වීමට අවස්ථාව සලසයි.',
    remedy: 'ගමනේදී ප්‍රවේශම් වන්න.',
    status: 'neutral'
  }
];

export const FALLBACK_OMEN: OmenData = {
  keywords: [],
  prediction: 'සාමාන්‍ය ප්‍රතිඵලයකි.',
  context: 'මෙම නිමිත්ත පිළිබඳව පැහැදිලි විස්තරයක් ලබා ගැනීමට තවදුරටත් අවධානය යොමු කළ යුතුය.',
  remedy: 'නිතර යහපත් ක්‍රියාවල නිරත වී ආශිර්වාදය ලබා ගන්න.',
  status: 'neutral'
};
