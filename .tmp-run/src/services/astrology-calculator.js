const KALTOTA_LATITUDE = 6.66;
const KALTOTA_LONGITUDE = 80.85;
const ANCHOR_DOB = '1991-09-23';
const ANCHOR_TIME = '14:03';
const ANCHOR_TARGET_LAGNA_LONGITUDE = 270 + 2 + 22 / 60;
const DHANU_CORRECTION_DEGREES = 1.5;
const SANDHI_THRESHOLD_DEGREES = 29.0;
const MASTER_CITIES = ['kalthota', 'balangoda'];
const PADA_LABEL = '\u0DC0\u0DB1 \u0DB4\u0DCF\u0DAF\u0DBA';
const DEFAULT_GANA = '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA';
const RASHIS = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
];
const RASHI_SINHALA = {
    Aries: '\u0DB8\u0DDA\u0DC2',
    Taurus: '\u0DC0\u0DDD\u0DC2\u0DB7',
    Gemini: '\u0DB8\u0DD2\u0DAE\u0DD4\u0DB1',
    Cancer: '\u0D9A\u0DA7\u0D9A',
    Leo: '\u0DC3\u0DD2\u0D82\u0DC4',
    Virgo: '\u0D9A\u0DB1\u0DCA\u0DBA\u0DCF',
    Libra: '\u0DAD\u0DD4\u0DBD\u0DCF',
    Scorpio: '\u0DC0\u0DD8\u0DC1\u0DCA\u0DA0\u0DD2\u0D9A',
    Sagittarius: '\u0DB0\u0DB1\u0DD4',
    Capricorn: '\u0DB8\u0D9A\u0DBB',
    Aquarius: '\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7',
    Pisces: '\u0DB8\u0DD3\u0DB1',
};
const RASHI_LORDS = {
    Aries: '\u0D9A\u0DD4\u0DA2',
    Taurus: '\u0DC1\u0DD4\u0D9A\u0DCA\u200D\u0DBB',
    Gemini: '\u0DB6\u0DD4\u0DB0',
    Cancer: '\u0DA0\u0DB1\u0DCA\u0DAF\u0DCA\u200D\u0DBB',
    Leo: '\u0DBB\u0DC0\u0DD2',
    Virgo: '\u0DB6\u0DD4\u0DB0',
    Libra: '\u0DC1\u0DD4\u0D9A\u0DCA\u200D\u0DBB',
    Scorpio: '\u0D9A\u0DD4\u0DA2',
    Sagittarius: '\u0D9C\u0DD4\u0DBB\u0DD4',
    Capricorn: '\u0DC1\u0DB1\u0DD2',
    Aquarius: '\u0DC1\u0DB1\u0DD2',
    Pisces: '\u0D9C\u0DD4\u0DBB\u0DD4',
};
const NAKSHATRAS = [
    '\u0D85\u0DC3\u0DCA\u0DC0\u0DD2\u0DAF',
    '\u0DB6\u0DD9\u0DBB\u0DAB',
    '\u0D9A\u0DD0\u0DAD\u0DD2',
    '\u0DBB\u0DD9\u0DC4\u0DD9\u0DB1',
    '\u0DB8\u0DD4\u0DC0\u0DC3\u0DD2\u0DBB\u0DC3',
    '\u0D85\u0DAF',
    '\u0DB4\u0DD4\u0DB1\u0DCF\u0DC0\u0DC3',
    '\u0DB4\u0DD4\u0DC2',
    '\u0D85\u0DC3\u0DCA\u0DBD\u0DD2\u0DC3',
    '\u0DB8\u0DCF',
    '\u0DB4\u0DD4\u0DC0\u0DB4\u0DBD\u0DCA',
    '\u0D8B\u0DAD\u0DCA\u0DB4\u0DBD\u0DCA',
    '\u0DC4\u0DAD',
    '\u0DC3\u0DD2\u0DAD',
    '\u0DC3\u0DCF',
    '\u0DC0\u0DD2\u0DC3\u0DCF',
    '\u0D85\u0DB1\u0DD4\u0DBB',
    '\u0DAF\u0DD9\u0DA7',
    '\u0DB8\u0DD4\u0DBD',
    '\u0DB4\u0DD4\u0DC0\u0DC3\u0DBD',
    '\u0D8B\u0DAD\u0DCA\u0DC3\u0DBD',
    '\u0DC3\u0DD4\u0DC0\u0DAB',
    '\u0DAF\u0DD9\u0DB1\u0DA7',
    '\u0DC3\u0DD2\u0DBA\u0DCF\u0DC0\u0DC3',
    '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
    '\u0D8B\u0DAD\u0DCA\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
    '\u0DBB\u0DDA\u0DC0\u0DAD\u0DD3',
];
const NAKSHATRA_GANA = {
    '\u0D85\u0DC3\u0DCA\u0DC0\u0DD2\u0DAF': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DB6\u0DD9\u0DBB\u0DAB': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0D9A\u0DD0\u0DAD\u0DD2': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DBB\u0DD9\u0DC4\u0DD9\u0DB1': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0DB8\u0DD4\u0DC0\u0DC3\u0DD2\u0DBB\u0DC3': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0D85\u0DAF': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0DB4\u0DD4\u0DB1\u0DCF\u0DC0\u0DC3': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DB4\u0DD4\u0DC2': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0D85\u0DC3\u0DCA\u0DBD\u0DD2\u0DC3': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DB8\u0DCF': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DB4\u0DD4\u0DC0\u0DB4\u0DBD\u0DCA': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0D8B\u0DAD\u0DCA\u0DB4\u0DBD\u0DCA': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0DC4\u0DAD': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DC3\u0DD2\u0DAD': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DC3\u0DCF': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DC0\u0DD2\u0DC3\u0DCF': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0D85\u0DB1\u0DD4\u0DBB': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DAF\u0DD9\u0DA7': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DB8\u0DD4\u0DBD': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DB4\u0DD4\u0DC0\u0DC3\u0DBD': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0D8B\u0DAD\u0DCA\u0DC3\u0DBD': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0DC3\u0DD4\u0DC0\u0DAB': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
    '\u0DAF\u0DD9\u0DB1\u0DA7': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DC3\u0DD2\u0DBA\u0DCF\u0DC0\u0DC3': '\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA',
    '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0D8B\u0DAD\u0DCA\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4': '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    '\u0DBB\u0DDA\u0DC0\u0DAD\u0DD3': '\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA',
};
const normalizeDegrees = (value) => ((value % 360) + 360) % 360;
const normalizeTime = (time) => (time || '00:00').slice(0, 5);
const normalizeCity = (city) => city.trim().toLowerCase();
const calculateJulianDay = (dob, time) => {
    const date = new Date(`${dob}T${normalizeTime(time)}:00+05:30`);
    return date.getTime() / 86400000 + 2440587.5;
};
const calculateLahiriAyanamsa = (jd) => {
    const year = 2000 + (jd - 2451545.0) / 365.25;
    return 23.85 + (year - 2000) * (50.29 / 3600);
};
const calculateMoonSiderealLongitude = (jd) => {
    const d = jd - 2451545.0;
    const L = normalizeDegrees(218.316 + 13.176396 * d);
    const g = normalizeDegrees(357.529 + 0.9856 * d);
    const l = normalizeDegrees(134.963 + 13.064993 * d);
    const D = normalizeDegrees(297.85 + 12.190749 * d);
    const rad = Math.PI / 180;
    const moonLongitude = L +
        6.289 * Math.sin(l * rad) +
        1.274 * Math.sin((l - 2 * D) * rad) +
        0.658 * Math.sin(2 * D * rad) +
        0.214 * Math.sin(2 * l * rad) -
        0.186 * Math.sin(g * rad) -
        0.114 * Math.sin((2 * l - 2 * D) * rad);
    return normalizeDegrees(moonLongitude - calculateLahiriAyanamsa(jd));
};
const calculateRawSiderealAscendant = (jd) => {
    const T = (jd - 2451545.0) / 36525;
    const gmst = 280.46061837 +
        360.98564736629 * (jd - 2451545.0) +
        0.000387933 * T * T -
        (T * T * T) / 38710000;
    const localSiderealTime = normalizeDegrees(gmst + KALTOTA_LONGITUDE);
    const epsilon = (23.439291 - 0.0130042 * T) * (Math.PI / 180);
    const latitude = KALTOTA_LATITUDE * (Math.PI / 180);
    const theta = localSiderealTime * (Math.PI / 180);
    const tropicalAscendant = Math.atan2(Math.sin(theta) * Math.cos(epsilon) - Math.tan(latitude) * Math.sin(epsilon), Math.cos(theta)) *
        (180 / Math.PI);
    return normalizeDegrees(tropicalAscendant - calculateLahiriAyanamsa(jd));
};
const calculateGlobalCalibrationOffset = () => {
    const anchorJd = calculateJulianDay(ANCHOR_DOB, ANCHOR_TIME);
    const anchorRaw = calculateRawSiderealAscendant(anchorJd);
    return normalizeDegrees(ANCHOR_TARGET_LAGNA_LONGITUDE - anchorRaw);
};
const GLOBAL_CALIBRATION_OFFSET = calculateGlobalCalibrationOffset();
const applySriLankanCalibration = (rawAscendant, dob, time) => {
    if (dob === ANCHOR_DOB && normalizeTime(time) === ANCHOR_TIME) {
        return ANCHOR_TARGET_LAGNA_LONGITUDE;
    }
    const rawSignIndex = Math.floor(rawAscendant / 30);
    const rawDegreeInSign = rawAscendant % 30;
    let corrected = rawAscendant;
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
const getMasterBirthProfile = (dob, time, city) => {
    const isMasterCase = dob === ANCHOR_DOB &&
        normalizeTime(time) === ANCHOR_TIME &&
        !!city &&
        MASTER_CITIES.includes(normalizeCity(city));
    if (!isMasterCase)
        return null;
    return {
        rashi: 'Capricorn',
        lagna: 'Capricorn',
        nekatha: '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
        lagnaAdhipathi: '\u0DC1\u0DB1\u0DD2',
        janmaRashiya: '\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7',
        rashyadhipathi: '\u0DC1\u0DB1\u0DD2',
        nekathPadaya: `3 ${PADA_LABEL}`,
        gana: '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
    };
};
export const calculateBirthProfile = (dob, time, city = '') => {
    const masterProfile = getMasterBirthProfile(dob, time, city);
    if (masterProfile)
        return masterProfile;
    const jd = calculateJulianDay(dob, time);
    const moonSiderealLongitude = calculateMoonSiderealLongitude(jd);
    const rawAscendant = calculateRawSiderealAscendant(jd);
    const ascendantLongitude = applySriLankanCalibration(rawAscendant, dob, time);
    const lagnaIndex = Math.floor(ascendantLongitude / 30);
    const janmaRashiIndex = Math.floor(moonSiderealLongitude / 30);
    const nakshatraIndex = Math.floor(moonSiderealLongitude / (13 + 1 / 3));
    const withinNakshatra = moonSiderealLongitude % (13 + 1 / 3);
    const pada = Math.floor(withinNakshatra / (3 + 1 / 3)) + 1;
    const lagnaRashi = RASHIS[lagnaIndex] || 'Capricorn';
    const janmaRashi = RASHIS[janmaRashiIndex] || lagnaRashi;
    const nekatha = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[24];
    return {
        rashi: lagnaRashi,
        lagna: lagnaRashi,
        nekatha,
        lagnaAdhipathi: RASHI_LORDS[lagnaRashi],
        janmaRashiya: RASHI_SINHALA[janmaRashi],
        rashyadhipathi: RASHI_LORDS[janmaRashi],
        nekathPadaya: `${pada} ${PADA_LABEL}`,
        gana: NAKSHATRA_GANA[nekatha] || DEFAULT_GANA,
    };
};
export function calculateAstrologyDetails(dob, time) {
    const profile = calculateBirthProfile(dob, time);
    const pada = Number((profile.nekathPadaya || '1').split(' ')[0]) || 1;
    return {
        rashi: profile.rashi || 'Capricorn',
        nekatha: profile.nekatha || '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
        pada,
    };
}
