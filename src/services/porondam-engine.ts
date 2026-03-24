import { PorondamResult, UserProfile } from "../types";
import { calculateAstrologyDetails } from "./astrology-calculator";
import { getNakshatraIndex, getRashiIndex, porondamTerms } from "./porondam-data";

type MatchPerson = Partial<UserProfile> & {
  dob?: string;
  birthTime?: string;
  time?: string;
  city?: string;
  name?: string;
};

const POSITIVE = "ගැලපේ";
const NEGATIVE = "නොගැලපේ";

const pushTerm = (
  table: PorondamResult["table"],
  name: string,
  description: string,
  isMatch: boolean
) => {
  table.push({
    name,
    description,
    result: isMatch ? POSITIVE : NEGATIVE,
    isMatch,
  });
};

const getPersonAstro = (person: MatchPerson) => {
  if (person.nekatha && person.rashi) {
    return { nekatha: person.nekatha, rashi: person.rashi };
  }

  return calculateAstrologyDetails(
    person.dob || "",
    person.birthTime || person.time || "00:00"
  );
};

export const calculatePorondam = (
  profile: UserProfile,
  partner: MatchPerson
): PorondamResult => {
  const person1 = getPersonAstro(profile);
  const person2 = getPersonAstro(partner);

  const n1 = getNakshatraIndex(person1.nekatha);
  const n2 = getNakshatraIndex(person2.nekatha);
  const r1 = getRashiIndex(person1.rashi);
  const r2 = getRashiIndex(person2.rashi);

  const nakshatraDist = (n2 - n1 + 27) % 27;
  const rashiDist = (r2 - r1 + 12) % 12;

  const table: PorondamResult["table"] = [];
  const dosha: string[] = [];
  const recommendations: string[] = [];
  let matchCount = 0;

  const add = (name: string, description: string, isMatch: boolean) => {
    pushTerm(table, name, description, isMatch);
    if (isMatch) {
      matchCount += 1;
    }
  };

  add(
    "නැකැත්",
    "සාමාන්‍ය ගැලපීම සහ යහපත.",
    [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26].includes(nakshatraDist)
  );

  const gana1 = n1 % 3;
  const gana2 = n2 % 3;
  add(
    "ගණ",
    "ස්වභාවය සහ හැසිරීම ගැලපීම.",
    gana1 === gana2 || (gana1 === 0 && gana2 === 1) || (gana1 === 1 && gana2 === 0)
  );

  add(
    "මහේන්ද්‍ර",
    "සමෘද්ධිය සහ දරු සම්පත් ගැන බැලීම.",
    [4, 7, 10, 13, 16, 19, 22, 25].includes(nakshatraDist)
  );

  add(
    "ස්ත්‍රී දීර්ඝ",
    "විවාහ ජීවිතයේ දිගුකාලීන ස්ථාවර බව.",
    nakshatraDist > 15
  );

  add(
    "යෝනි",
    "ශාරීරික හා අභ්‍යන්තර ගැලපීම.",
    (n1 % 14) !== (n2 % 14)
  );

  add(
    "රාශි",
    "ගෙදර ජීවිතය සහ හැඟීම් ගැලපීම.",
    ![2, 6, 8, 12].includes(rashiDist)
  );

  add(
    "රාශ්‍යාධිපති",
    "මනස සහ අදහස් ගැලපීම.",
    (r1 % 2) === (r2 % 2)
  );

  add(
    "වශ්‍ය",
    "එකිනෙකාට ඇති ආකර්ෂණය.",
    (r1 < 6 && r2 < 6) || (r1 >= 6 && r2 >= 6)
  );

  const rajjuMatch = (n1 % 5) !== (n2 % 5);
  add(
    "රජ්ජු",
    "විවාහ ජීවිතයේ ආරක්ෂාව.",
    rajjuMatch
  );
  if (!rajjuMatch) {
    dosha.push("රජ්ජු දෝෂයක් පෙනේ. මේ ගැලපීමේදී වැඩි සැලකිල්ලක් අවශ්‍යයි.");
  }

  const vedhaPairs = [
    [1, 18], [2, 17], [3, 16], [4, 15], [5, 14], [6, 13], [7, 12],
    [8, 11], [9, 10], [19, 27], [20, 26], [21, 25], [22, 24],
  ];
  const vedhaMatch = !vedhaPairs.some(
    ([a, b]) => (n1 === a && n2 === b) || (n1 === b && n2 === a)
  );
  add(
    "වේධ",
    "බාධා සහ ගැටලු ඇතිවීම.",
    vedhaMatch
  );
  if (!vedhaMatch) {
    dosha.push("වේධ දෝෂයක් පෙනේ. නැවත නැවත ගැටලු ඇතිවිය හැක.");
  }

  porondamTerms.slice(10).forEach((term, idx) => {
    const isMatch = ((n1 + n2 + r1 + r2 + idx) % 3) !== 0;
    add(term.name, term.description, isMatch);
  });

  const matchingPercentage = Math.round((matchCount / porondamTerms.length) * 100);

  if (matchingPercentage >= 70) {
    recommendations.push("මේ ගැලපීම සම්පූර්ණයෙන්ම හොඳ මට්ටමක පවතී.");
  } else if (matchingPercentage >= 50) {
    recommendations.push("මේ ගැලපීම මධ්‍යම මට්ටමක පවතී. තව ටිකක් සොයා බැලීම හොඳයි.");
  } else {
    recommendations.push("මේ ගැලපීම දුර්වලයි. තීරණය ගන්න කලින් හොඳින් සලකා බලන්න.");
  }

  if (dosha.length > 0) {
    recommendations.push("අවසාන තීරණයට පෙර සුදුසු වතපිළිවෙත් ගැන අහලා බලන්න.");
  } else {
    recommendations.push("ප්‍රධාන දෝෂයක් ඉතා තද ලෙස පෙනෙන්නේ නැහැ.");
  }

  return {
    matchingPercentage,
    table,
    dosha,
    recommendations,
  };
};
