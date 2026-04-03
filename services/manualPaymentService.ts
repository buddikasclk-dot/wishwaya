import fs from 'fs';
import path from 'path';
import {
  ManualPaymentBankDetails,
  ManualPaymentFeature,
  ManualPaymentRequest,
  ManualPaymentStatus,
} from '../src/types.ts';

type SubmitManualPaymentInput = {
  userId: string;
  feature: ManualPaymentFeature;
  featureLabel: string;
  amount: number;
  currency: string;
  paymentReference?: string | null;
  note?: string | null;
  slipBase64: string;
  slipMimeType: string;
  slipOriginalName: string;
  orderId?: string | null;
  reportId?: string | null;
  packageCode?: 'starter_200' | 'premium_500' | null;
};

const createId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const readJsonFile = <T>(filePath: string, fallback: T): T => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    console.error('[manual-payment] failed to read file', filePath, error);
    return fallback;
  }
};

const extensionFromMimeType = (mimeType: string) => {
  if (mimeType === 'application/pdf') return '.pdf';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  return '.jpg';
};

export class ManualPaymentService {
  private requestsFile: string;
  private uploadsDir: string;

  constructor(dataDir: string) {
    const paymentsDir = path.join(dataDir, 'manual-payments');
    ensureDir(paymentsDir);
    this.uploadsDir = path.join(paymentsDir, 'uploads');
    ensureDir(this.uploadsDir);
    this.requestsFile = path.join(paymentsDir, 'requests.json');
  }

  getBankDetails(): ManualPaymentBankDetails {
    return {
      accountName: process.env.BANK_TRANSFER_ACCOUNT_NAME || 'WMNRB WEERASINGHE',
      bankName: process.env.BANK_TRANSFER_BANK_NAME || 'SAMATH BANK',
      accountNumber: process.env.BANK_TRANSFER_ACCOUNT_NUMBER || '101357510871',
      branch: process.env.BANK_TRANSFER_BRANCH || 'MAHARAGAMA',
      hotline: process.env.BANK_TRANSFER_HOTLINE || '+94779697889',
      instructions:
        process.env.BANK_TRANSFER_INSTRUCTIONS ||
        'Transfer the exact amount, upload your deposit slip as PDF or image, and our admin team will review it as soon as possible.',
    };
  }

  isEnabled() {
    const details = this.getBankDetails();
    return Boolean(details.accountName && details.bankName && details.accountNumber);
  }

  list(feature?: ManualPaymentFeature, status?: ManualPaymentStatus) {
    return this.getAll().filter((entry) => {
      if (feature && entry.feature !== feature) return false;
      if (status && entry.status !== status) return false;
      return true;
    });
  }

  listForUser(userId: string, feature?: ManualPaymentFeature) {
    return this.getAll().filter((entry) => entry.userId === userId && (!feature || entry.feature === feature));
  }

  getById(id: string) {
    return this.getAll().find((entry) => entry.id === id) || null;
  }

  submit(input: SubmitManualPaymentInput): ManualPaymentRequest {
    const now = new Date().toISOString();
    const id = createId('manualpay');
    const fileName = `${id}${extensionFromMimeType(input.slipMimeType)}`;
    const filePath = path.join(this.uploadsDir, fileName);
    const base64Payload = input.slipBase64.includes(',')
      ? input.slipBase64.split(',').pop() || ''
      : input.slipBase64;

    fs.writeFileSync(filePath, Buffer.from(base64Payload, 'base64'));

    const request: ManualPaymentRequest = {
      id,
      userId: input.userId,
      feature: input.feature,
      featureLabel: input.featureLabel,
      amount: input.amount,
      currency: input.currency,
      status: 'submitted',
      paymentMethod: 'bank_transfer',
      paymentReference: input.paymentReference?.trim() || null,
      note: input.note?.trim() || null,
      slipUrl: `/api/manual-payments/${id}/slip`,
      slipMimeType: input.slipMimeType,
      slipOriginalName: input.slipOriginalName || fileName,
      orderId: input.orderId || null,
      reportId: input.reportId || null,
      packageCode: input.packageCode || null,
      approvedAt: null,
      approvedBy: null,
      rejectedAt: null,
      rejectedBy: null,
      adminNote: null,
      createdAt: now,
      updatedAt: now,
    };

    const requests = this.getAll();
    requests.unshift(request);
    this.saveAll(requests);
    return request;
  }

  markApproved(id: string, adminEmail: string, adminNote?: string | null) {
    const requests = this.getAll();
    const request = requests.find((entry) => entry.id === id);
    if (!request) {
      throw new Error('Manual payment request not found');
    }
    if (request.status === 'approved') {
      return request;
    }
    if (request.status === 'rejected') {
      throw new Error('Rejected request cannot be approved');
    }

    request.status = 'approved';
    request.approvedAt = new Date().toISOString();
    request.approvedBy = adminEmail;
    request.adminNote = adminNote?.trim() || null;
    request.updatedAt = request.approvedAt;
    this.saveAll(requests);
    return request;
  }

  markRejected(id: string, adminEmail: string, adminNote?: string | null) {
    const requests = this.getAll();
    const request = requests.find((entry) => entry.id === id);
    if (!request) {
      throw new Error('Manual payment request not found');
    }
    if (request.status === 'approved') {
      throw new Error('Approved request cannot be rejected');
    }
    if (request.status === 'rejected') {
      return request;
    }

    request.status = 'rejected';
    request.rejectedAt = new Date().toISOString();
    request.rejectedBy = adminEmail;
    request.adminNote = adminNote?.trim() || null;
    request.updatedAt = request.rejectedAt;
    this.saveAll(requests);
    return request;
  }

  deleteRequest(id: string) {
    const requests = this.getAll();
    const request = requests.find((entry) => entry.id === id);
    if (!request) {
      throw new Error('Manual payment request not found');
    }

    const remaining = requests.filter((entry) => entry.id !== id);
    const filePath = this.getSlipFilePath(id);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    this.saveAll(remaining);
    return request;
  }

  getSlipFilePath(id: string) {
    const request = this.getById(id);
    if (!request) return null;
    const matches = fs
      .readdirSync(this.uploadsDir)
      .filter((entry) => entry.startsWith(id))
      .map((entry) => path.join(this.uploadsDir, entry));
    return matches[0] || null;
  }

  private getAll(): ManualPaymentRequest[] {
    return readJsonFile<ManualPaymentRequest[]>(this.requestsFile, []);
  }

  private saveAll(rows: ManualPaymentRequest[]) {
    fs.writeFileSync(this.requestsFile, JSON.stringify(rows, null, 2), 'utf-8');
  }
}
