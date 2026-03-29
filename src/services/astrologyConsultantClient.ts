import { ConsultantCredits, UserProfile } from '../types';

export const fetchConsultantCredits = async (
  userId: string,
  userEmail?: string | null
): Promise<ConsultantCredits> => {
  const params = new URLSearchParams({ userId });
  if (userEmail) params.set('userEmail', userEmail);
  const response = await fetch(`/api/consultant/credits?${params.toString()}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch consultant credits');
  }
  return data as ConsultantCredits;
};

export const createConsultantCheckoutSession = async (input: {
  userId: string;
  packageCode: 'starter_200' | 'premium_500';
  customerEmail?: string | null;
}) => {
  const response = await fetch('/api/consultant/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to create consultant checkout');
  }
  return data as { checkoutUrl: string | null; sessionId: string | null; packageCode: string };
};

export const sendConsultantMessage = async (input: {
  userId: string;
  userEmail?: string | null;
  message: string;
  userProfile: UserProfile;
}) => {
  const response = await fetch('/api/consultant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : 'Consultant chat failed';
    throw new Error(message);
  }
  return data as
    | { status: 'ok'; message: string; credits: ConsultantCredits }
    | { status: 'limit_reached'; message: string; credits: ConsultantCredits }
    | { status: 'temporary_unavailable'; message: string; credits: ConsultantCredits | null };
};
