
import { BIRTHMARK_OMENS, LIZARD_OMENS, FALLBACK_OMEN, OmenData } from '../data/omensData';
import { OmenResult } from '../types';

export const matchOmen = (type: 'birthmark' | 'lizard', input: string): OmenResult => {
  const normalizedInput = input.toLowerCase().trim();
  const dataSet = type === 'birthmark' ? BIRTHMARK_OMENS : LIZARD_OMENS;

  // Try exact match or keyword match
  const matched = dataSet.find(item => 
    item.keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()))
  );

  const result = matched || FALLBACK_OMEN;

  return {
    prediction: result.prediction,
    context: result.context,
    remedy: result.remedy
  };
};
