export const porondamTerms = [
  { key: "nakshatra", name: "නැකැත්", description: "සාමාන්‍ය ගැලපීම සහ යහපත." },
  { key: "gana", name: "ගණ", description: "ස්වභාවය සහ හැසිරීම ගැලපීම." },
  { key: "mahendra", name: "මහේන්ද්‍ර", description: "සමෘද්ධිය සහ දරු සම්පත් ගැන බැලීම." },
  { key: "streeDeergha", name: "ස්ත්‍රී දීර්ඝ", description: "විවාහ ජීවිතයේ දිගුකාලීන ස්ථාවර බව." },
  { key: "yoni", name: "යෝනි", description: "ශාරීරික හා අභ්‍යන්තර ගැලපීම." },
  { key: "rashi", name: "රාශි", description: "ගෙදර ජීවිතය සහ හැඟීම් ගැලපීම." },
  { key: "rashiAdhipathi", name: "රාශ්‍යාධිපති", description: "මනස සහ අදහස් ගැලපීම." },
  { key: "vashya", name: "වශ්‍ය", description: "එකිනෙකාට ඇති ආකර්ෂණය." },
  { key: "rajju", name: "රජ්ජු", description: "විවාහ ජීවිතයේ ආරක්ෂාව." },
  { key: "vedha", name: "වේධ", description: "බාධා සහ ගැටලු ඇතිවීම." },
  { key: "vruksha", name: "වෘක්ෂ", description: "දරු සම්පත් සහ පවුල් වර්ධනය." },
  { key: "ayusha", name: "ආයුෂ", description: "එකට ගත කරන ජීවිතයේ ශක්තිය." },
  { key: "pakshi", name: "පක්ෂි", description: "ශක්තිය සහ ක්‍රියාකාරී ගැලපීම." },
  { key: "bhootha", name: "භූත", description: "අභ්‍යන්තර සහ ආධ්‍යාත්මික ගැලපීම." },
  { key: "gothra", name: "ගෝත්‍ර", description: "පවුල් පසුබිම ගැලපීම." },
  { key: "varna", name: "වර්ණ", description: "වටිනාකම් සහ ජීවන රටා ගැලපීම." },
  { key: "linga", name: "ලිංග", description: "ස්වභාවික හා ශාරීරික ගැලපීම." },
  { key: "nadi", name: "නාඩි", description: "සෞඛ්‍ය සහ වංශගත ගැලපීම." },
  { key: "dina", name: "දින", description: "දෛනික සතුට සහ පහසුව." },
  { key: "grahaMaitri", name: "ග්‍රහ මෛත්‍රී", description: "මිත්‍රත්වය සහ අවබෝධය." },
] as const;

const nakshatras = [
  "අස්විද", "බෙරණ", "කැති", "රෙහෙණ", "මුවසිරස", "අද", "පුනාවස", "පුෂ", "අස්ලිස",
  "මා", "පුවපල්", "උත්පල්", "හත", "සිත", "සා", "විසා", "අනුර", "දෙට",
  "මුල", "පුවසල", "උත්සල", "සුවණ", "දෙනට", "සියාවස", "පුවපුටුප", "උත්පුටුප", "රේවතී",
];

const rashis = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const getNakshatraIndex = (name: string) => {
  const safeName = name || "";
  const index = nakshatras.findIndex((n) => safeName.includes(n));
  return index >= 0 ? index : 0;
};

export const getRashiIndex = (name: string) => {
  const safeName = (name || "").toLowerCase();
  const index = rashis.findIndex((r) => safeName.includes(r.toLowerCase()));
  return index >= 0 ? index : 0;
};
