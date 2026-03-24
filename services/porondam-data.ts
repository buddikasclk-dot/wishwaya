export const nakshatras = [
  "අස්විද", "බෙරණ", "කැති", "රෙහෙණ", "මුවසිරස", "අද", "පුනාවස", "පුෂ", "අස්ලිස",
  "මා", "පුවපල්", "උත්පල්", "හත", "සිත", "සා", "විසා", "අනුර", "දෙට",
  "මුල", "පුවසල", "උත්සල", "සුවණ", "දෙනට", "සියාවස", "පුවපුටුප", "උත්පුටුප", "රේවතී"
];

export const rashis = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const porondamTerms = [
  { key: "nakshatra", name: "නැකැත් පොරොන්දම", description: "ආයුෂ සහ යහපැවැත්ම" },
  { key: "gana", name: "ගණ පොරොන්දම", description: "ගතිගුණ සහ ස්වභාවය" },
  { key: "mahendra", name: "මහේන්ද්‍ර පොරොන්දම", description: "දරුවන් සහ සමෘද්ධිය" },
  { key: "streeDeergha", name: "ස්ත්‍රී දීර්ඝ පොරොන්දම", description: "සතුට සහ සහජීවනය" },
  { key: "yoni", name: "යෝනි පොරොන්දම", description: "ලිංගික ගැලපීම" },
  { key: "rashi", name: "රාශි පොරොන්දම", description: "පවුලේ දියුණුව" },
  { key: "rashiAdhipathi", name: "රාශ්‍යාධිපති පොරොන්දම", description: "මානසික ගැලපීම" },
  { key: "vashya", name: "වශ්‍ය පොරොන්දම", description: "අන්‍යෝන්‍ය ආකර්ෂණය" },
  { key: "rajju", name: "රජ්ජු පොරොන්දම", description: "ස්වාමිපුරුෂයාගේ ආයුෂ" },
  { key: "vedha", name: "වේධ පොරොන්දම", description: "බාධා සහ කරදර" },
  { key: "vruksha", name: "වෘක්ෂ පොරොන්දම", description: "දරුඵල" },
  { key: "ayusha", name: "ආයුෂ පොරොන්දම", description: "දීර්ඝායුෂ" },
  { key: "pakshi", name: "පක්ෂි පොරොන්දම", description: "බලය සහ ආධිපත්‍යය" },
  { key: "bhootha", name: "භූත පොරොන්දම", description: "ආධ්‍යාත්මික ගැලපීම" },
  { key: "gothra", name: "ගෝත්‍ර පොරොන්දම", description: "පරම්පරාවේ ගැලපීම" },
  { key: "varna", name: "වර්ණ පොරොන්දම", description: "සමාජ තත්ත්වය" },
  { key: "linga", name: "ලිංග පොරොන්දම", description: "කායික ගැලපීම" },
  { key: "nadi", name: "නාඩි පොරොන්දම", description: "සෞඛ්‍යය සහ ජානමය ගැලපීම" },
  { key: "dina", name: "දින පොරොන්දම", description: "දෛනික ජීවිතයේ සතුට" },
  { key: "grahaMaitri", name: "ග්‍රහ මෛත්‍රී පොරොන්දම", description: "මිත්‍රත්වය සහ අවබෝධය" }
];

export const getNakshatraIndex = (name: string) => {
  const index = nakshatras.findIndex(n => name.includes(n));
  return index >= 0 ? index : 0;
};

export const getRashiIndex = (name: string) => {
  const index = rashis.findIndex(r => name.toLowerCase().includes(r.toLowerCase()));
  return index >= 0 ? index : 0;
};
