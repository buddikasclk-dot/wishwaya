
export interface GemstoneRule {
  lagna: string;
  gemstone: string;
  secondaryGemstone?: string;
  metal: string;
  finger: string;
  instructions: string;
  benefits: string;
  color: string;
  jewelryType: string;
}

export const GEMSTONE_RULES: Record<string, GemstoneRule> = {
  'Aries': {
    lagna: 'Aries',
    gemstone: 'රතු පබළු (Red Coral)',
    secondaryGemstone: 'සුදු නිල් (White Sapphire)',
    metal: 'රන් හෝ තඹ',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'අඟහරුවාදා දිනක උදෑසන සූර්ය උදාවෙන් පසු මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'ධෛර්යය, ශක්තිය සහ ආත්ම විශ්වාසය වර්ධනය කරයි. රුධිර සංසරණය යහපත් කරයි.',
    color: 'රතු',
    jewelryType: 'මුදුව (Ring)'
  },
  'Taurus': {
    lagna: 'Taurus',
    gemstone: 'දියමන්ති හෝ සුදු නිල් (Diamond/White Sapphire)',
    secondaryGemstone: 'පච්ච (Emerald)',
    metal: 'රිදී හෝ සුදු රන්',
    finger: 'මැද ඇඟිල්ල හෝ සුළැඟිල්ල',
    instructions: 'සිකුරාදා දිනක උදෑසන මුදුවක් ලෙස පැළඳීම වඩාත් සුදුසුය.',
    benefits: 'සැප සම්පත්, ආදරය සහ කලාත්මක හැකියාවන් වර්ධනය කරයි. පෞරුෂය ඔප්නංවයි.',
    color: 'සුදු / විනිවිද පෙනෙන',
    jewelryType: 'මුදුව (Ring)'
  },
  'Gemini': {
    lagna: 'Gemini',
    gemstone: 'පච්ච (Emerald)',
    secondaryGemstone: 'සුදු නිල් (White Sapphire)',
    metal: 'රන්',
    finger: 'සුළැඟිල්ල',
    instructions: 'බදාදා දිනක උදෑසන බුධ හෝරාවෙන් මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'බුද්ධිය, මතක ශක්තිය සහ සන්නිවේදන හැකියාවන් දියුණු කරයි. ව්‍යාපාරික සාර්ථකත්වය ලබා දෙයි.',
    color: 'කොළ',
    jewelryType: 'මුදුව (Ring)'
  },
  'Cancer': {
    lagna: 'Cancer',
    gemstone: 'මුතු (Pearl)',
    secondaryGemstone: 'චන්ද්‍රකාන්ති (Moonstone)',
    metal: 'රිදී',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'සඳුදා දිනක උදෑසන චන්ද්‍ර හෝරාවෙන් මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'මනසේ සාමය, මානසික සහනය සහ පවුලේ සතුට වර්ධනය කරයි. කෝපය පාලනය කරයි.',
    color: 'සුදු',
    jewelryType: 'මුදුව (Ring)'
  },
  'Leo': {
    lagna: 'Leo',
    gemstone: 'පද්මරාග (Ruby)',
    secondaryGemstone: 'රතු පබළු (Red Coral)',
    metal: 'රන්',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'ඉරිදා දිනක උදෑසන රවි හෝරාවෙන් මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'ගෞරවය, බලය සහ නායකත්ව හැකියාවන් ලබා දෙයි. පියාගෙන් ලැබෙන සහයෝගය වැඩි කරයි.',
    color: 'රතු / රෝස',
    jewelryType: 'මුදුව (Ring)'
  },
  'Virgo': {
    lagna: 'Virgo',
    gemstone: 'පච්ච (Emerald)',
    secondaryGemstone: 'සුදු නිල් (White Sapphire)',
    metal: 'රන්',
    finger: 'සුළැඟිල්ල',
    instructions: 'බදාදා දිනක උදෑසන මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'විශ්ලේෂණාත්මක බුද්ධිය සහ අධ්‍යාපනික සාර්ථකත්වය ලබා දෙයි. සෞඛ්‍යය යහපත් කරයි.',
    color: 'කොළ',
    jewelryType: 'මුදුව (Ring)'
  },
  'Libra': {
    lagna: 'Libra',
    gemstone: 'දියමන්ති හෝ සුදු නිල් (Diamond/White Sapphire)',
    secondaryGemstone: 'පච්ච (Emerald)',
    metal: 'රිදී හෝ සුදු රන්',
    finger: 'මැද ඇඟිල්ල හෝ සුළැඟිල්ල',
    instructions: 'සිකුරාදා දිනක උදෑසන මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'සබඳතා සාර්ථක කර ගැනීමට සහ සමාජීය පිළිගැනීම ලබා ගැනීමට උපකාරී වේ.',
    color: 'සුදු',
    jewelryType: 'මුදුව (Ring)'
  },
  'Scorpio': {
    lagna: 'Scorpio',
    gemstone: 'රතු පබළු (Red Coral)',
    secondaryGemstone: 'පද්මරාග (Ruby)',
    metal: 'රන් හෝ තඹ',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'අඟහරුවාදා දිනක උදෑසන මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'බාධක ජය ගැනීමට සහ සතුරන් පරාජය කිරීමට ශක්තිය ලබා දෙයි.',
    color: 'රතු',
    jewelryType: 'මුදුව (Ring)'
  },
  'Sagittarius': {
    lagna: 'Sagittarius',
    gemstone: 'පුෂ්පරාග (Yellow Sapphire)',
    secondaryGemstone: 'රතු පබළු (Red Coral)',
    metal: 'රන්',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'බ්‍රහස්පතින්දා දිනක උදෑසන ගුරු හෝරාවෙන් මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'වාසනාව, ධනය සහ අධ්‍යාත්මික දියුණුව ලබා දෙයි. උසස් අධ්‍යාපනයට ශුභයි.',
    color: 'කහ',
    jewelryType: 'මුදුව (Ring)'
  },
  'Capricorn': {
    lagna: 'Capricorn',
    gemstone: 'නිල් (Blue Sapphire)',
    secondaryGemstone: 'දියමන්ති (Diamond)',
    metal: 'යකඩ හෝ රිදී',
    finger: 'මැද ඇඟිල්ල',
    instructions: 'සෙනසුරාදා දිනක සවස් කාලයේ මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'ස්ථාවරත්වය, විනය සහ වෘත්තීය දියුණුව ලබා දෙයි. දීර්ඝායුෂ ලබා දෙයි.',
    color: 'නිල්',
    jewelryType: 'මුදුව (Ring)'
  },
  'Aquarius': {
    lagna: 'Aquarius',
    gemstone: 'නිල් (Blue Sapphire)',
    secondaryGemstone: 'පච්ච (Emerald)',
    metal: 'යකඩ හෝ රිදී',
    finger: 'මැද ඇඟිල්ල',
    instructions: 'සෙනසුරාදා දිනක සවස් කාලයේ මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'නව නිපැයුම් හැකියාව සහ සමාජ සේවා කටයුතුවල සාර්ථකත්වය ලබා දෙයි.',
    color: 'නිල්',
    jewelryType: 'මුදුව (Ring)'
  },
  'Pisces': {
    lagna: 'Pisces',
    gemstone: 'පුෂ්පරාග (Yellow Sapphire)',
    secondaryGemstone: 'මුතු (Pearl)',
    metal: 'රන්',
    finger: 'මුදු ඇඟිල්ල',
    instructions: 'බ්‍රහස්පතින්දා දිනක උදෑසන මුදුවක් ලෙස පැළඳීම සුදුසුය.',
    benefits: 'ඥානය, මනසේ සාමය සහ ආගමික නැඹුරුව වර්ධනය කරයි.',
    color: 'කහ',
    jewelryType: 'මුදුව (Ring)'
  }
};

export const FALLBACK_GEMSTONE: GemstoneRule = {
  lagna: 'Unknown',
  gemstone: 'සුදු නිල් (White Sapphire)',
  metal: 'රිදී',
  finger: 'මුදු ඇඟිල්ල',
  instructions: 'ඕනෑම ශුභ දිනක උදෑසන පිරිසිදු වී මුදුවක් ලෙස පැළඳිය හැක.',
  benefits: 'පොදු යහපත සහ මානසික සහනය ලබා දෙයි.',
  color: 'සුදු',
  jewelryType: 'මුදුව (Ring)'
};
