import {
  ManualPaymentBankDetails,
  ManualPaymentFeature,
  ManualPaymentRequest,
} from '../types';

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export const fetchManualPaymentConfig = async (): Promise<{
  enabled: boolean;
  bankDetails: ManualPaymentBankDetails;
}> => {
  const response = await fetch('/api/manual-payments/config');
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to load bank transfer payment details');
  }
  return data as { enabled: boolean; bankDetails: ManualPaymentBankDetails };
};

export const submitAstroReportManualPayment = async (input: {
  userId: string;
  profile: unknown;
  paymentReference?: string;
  note?: string;
  slipBase64: string;
  slipMimeType: string;
  slipOriginalName: string;
}) => {
  const response = await fetch('/api/manual-payments/astro-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to submit report bank transfer');
  }
  return data as { request: ManualPaymentRequest };
};

export const submitConsultantManualPayment = async (input: {
  userId: string;
  packageCode: 'starter_200' | 'premium_500';
  paymentReference?: string;
  note?: string;
  slipBase64: string;
  slipMimeType: string;
  slipOriginalName: string;
}) => {
  const response = await fetch('/api/manual-payments/consultant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to submit consultant bank transfer');
  }
  return data as { request: ManualPaymentRequest };
};

export const fetchManualPayments = async (input: {
  adminEmail?: string | null;
  userId?: string | null;
  feature?: ManualPaymentFeature;
  status?: 'submitted' | 'approved' | 'rejected';
}) => {
  const params = new URLSearchParams();
  if (input.adminEmail) params.set('adminEmail', input.adminEmail);
  if (input.userId) params.set('userId', input.userId);
  if (input.feature) params.set('feature', input.feature);
  if (input.status) params.set('status', input.status);

  const response = await fetch(`/api/manual-payments?${params.toString()}`);
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to load manual payments');
  }
  return data as ManualPaymentRequest[];
};

export const reviewManualPayment = async (input: {
  requestId: string;
  adminEmail: string;
  decision: 'approve' | 'reject';
  adminNote?: string;
}) => {
  const response = await fetch(`/api/manual-payments/${encodeURIComponent(input.requestId)}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to review manual payment');
  }
  return data as { request: ManualPaymentRequest; applied: boolean };
};

export const deleteManualPayment = async (input: {
  requestId: string;
  adminEmail: string;
}) => {
  const response = await fetch(
    `/api/manual-payments/${encodeURIComponent(input.requestId)}?adminEmail=${encodeURIComponent(input.adminEmail)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to delete manual payment');
  }
  return data as { deleted: boolean; request: ManualPaymentRequest };
};
