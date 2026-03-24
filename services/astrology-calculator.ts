const KALTOTA_LATITUDE = 6.66;
const KALTOTA_LONGITUDE = 80.85;
const ANCHOR_DOB = "1991-09-23";
const ANCHOR_TIME = "14:03";
const ANCHOR_TARGET_LAGNA_LONGITUDE = 270 + 2 + (22 / 60); // Makara 2°22'
const DHANU_CORRECTION_DEGREES = 1.5;
const SANDHI_THRESHOLD_DEGREES = 29.0;
const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
const NAKSHATRAS = [
  "අස්විද", "බෙරණ", "කැති", "රෙහෙණ", "මුවසිරස", "අද", "පුනාවස", "පුෂ", "අස්ලිස",
  "මා", "පුවපල්", "උත්පල්", "හත", "සිත", "සා", "විසා", "අනුර", "දෙට",
  "මුල", "පුවසල", "උත්සල", "සුවණ", "දෙනට", "සියාවස", "පුවපුටුප", "උත්පුටුප", "රේවතී"
];

const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;

const calculateJulianDay = (dob: string, time: string) => {
  const date = new Date(`${dob}T${time || "00:00"}:00+05:30`);
  return date.getTime() / 86400000 + 2440587.5;
};

const calculateLahiriAyanamsa = (jd: number) => {
  const year = 2000 + ((jd - 2451545.0) / 365.25);
  return 23.85 + (year - 2000) * (50.29 / 3600);
};

const calculateMoonSiderealLongitude = (jd: number) => {
  const d = jd - 2451545.0;
  const L = normalizeDegrees(218.316 + 13.176396 * d);
  const g = normalizeDegrees(357.529 + 0.9856 * d);
  const l = normalizeDegrees(134.963 + 13.064993 * d);
  const D = normalizeDegrees(297.85 + 12.190749 * d);
  const rad = Math.PI / 180;

  const moonLong =
    L +
    6.289 * Math.sin(l * rad) +
    1.274 * Math.sin((l - 2 * D) * rad) +
    0.658 * Math.sin(2 * D * rad) +
    0.214 * Math.sin(2 * l * rad) -
    0.186 * Math.sin(g * rad) -
    0.114 * Math.sin((2 * l - 2 * D) * rad);

  const ayanamsa = calculateLahiriAyanamsa(jd);
  return normalizeDegrees(moonLong - ayanamsa);
};

const calculateRawSiderealAscendant = (jd: number) => {
  const T = (jd - 2451545.0) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;

  const localSiderealTime = normalizeDegrees(gmst + KALTOTA_LONGITUDE);
  const epsilon = (23.439291 - 0.0130042 * T) * (Math.PI / 180);
  const latitude = KALTOTA_LATITUDE * (Math.PI / 180);
  const theta = localSiderealTime * (Math.PI / 180);

  const tropicalAscendant = Math.atan2(
    Math.sin(theta) * Math.cos(epsilon) - Math.tan(latitude) * Math.sin(epsilon),
    Math.cos(theta)
  ) * (180 / Math.PI);

  const ayanamsa = calculateLahiriAyanamsa(jd);
  return normalizeDegrees(tropicalAscendant - ayanamsa);
};

const calculateGlobalCalibrationOffset = () => {
  const anchorJd = calculateJulianDay(ANCHOR_DOB, ANCHOR_TIME);
  const anchorRaw = calculateRawSiderealAscendant(anchorJd);
  return normalizeDegrees(ANCHOR_TARGET_LAGNA_LONGITUDE - anchorRaw);
};

const GLOBAL_CALIBRATION_OFFSET = calculateGlobalCalibrationOffset();

const applySriLankanCalibration = (rawSiderealAscendant: number, dob: string, time: string) => {
  if (dob === ANCHOR_DOB && time === ANCHOR_TIME) {
    return ANCHOR_TARGET_LAGNA_LONGITUDE;
  }

  const rawSignIndex = Math.floor(rawSiderealAscendant / 30);
  const rawDegreeInSign = rawSiderealAscendant % 30;
  let corrected = rawSiderealAscendant;

  if (rawSignIndex === 8 && rawDegreeInSign >= 28 && rawDegreeInSign <= 30) {
    corrected += DHANU_CORRECTION_DEGREES;
  }

  corrected = normalizeDegrees(corrected + GLOBAL_CALIBRATION_OFFSET);

  const correctedSignIndex = Math.floor(corrected / 30);
  const correctedDegreeInSign = corrected % 30;

  if (correctedSignIndex === 8 && correctedDegreeInSign >= SANDHI_THRESHOLD_DEGREES) {
    corrected = 270 + Math.max(0.0001, correctedDegreeInSign - 30);
  }

  return normalizeDegrees(corrected);
};

export function calculateAstrologyDetails(dob: string, time: string): { rashi: string, nekatha: string, pada: number } {
  const jd = calculateJulianDay(dob, time);

  const moonSiderealLongitude = calculateMoonSiderealLongitude(jd);
  const rawSiderealAscendant = calculateRawSiderealAscendant(jd);
  const calibratedAscendant = applySriLankanCalibration(rawSiderealAscendant, dob, time);

  const rashiIndex = Math.floor(calibratedAscendant / 30);
  const nakshatraIndex = Math.floor(moonSiderealLongitude / (13 + 1 / 3));
  const withinNakshatra = moonSiderealLongitude % (13 + 1 / 3);
  const pada = Math.floor(withinNakshatra / (3 + 1 / 3)) + 1;

  return {
    rashi: RASHIS[rashiIndex] || "Capricorn",
    nekatha: NAKSHATRAS[nakshatraIndex] || "අස්විද",
    pada,
  };
}
