import { AstroReportRecord, AstroReportRequirements, AstroReportSection, AstroReportStatus } from '../types';
import { UserProfile } from '../types';

const escapePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const wrapText = (text: string, maxChars = 78) => {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      return;
    }

    if (current) lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  return lines;
};

const buildPdfTextChunks = (title: string, sections: AstroReportSection[]) => {
  const lines = [title, '', ...sections.flatMap((section) => [section.title, ...wrapText(section.content), ''])];
  const chunks: string[] = [];
  let currentPage: string[] = [];

  lines.forEach((line) => {
    currentPage.push(line);
    if (currentPage.length >= 34) {
      chunks.push(currentPage.join('\n'));
      currentPage = [];
    }
  });

  if (currentPage.length) chunks.push(currentPage.join('\n'));
  return chunks;
};

const createSimplePdfBlob = (title: string, sections: AstroReportSection[]) => {
  const pageChunks = buildPdfTextChunks(title, sections);
  const objects: string[] = [];
  const offsets: number[] = [0];

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');

  const pageRefs = pageChunks.map((_, index) => `${4 + index * 2} 0 R`).join(' ');
  objects.push(`2 0 obj << /Type /Pages /Kids [${pageRefs}] /Count ${pageChunks.length} >> endobj`);
  objects.push('3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');

  pageChunks.forEach((chunk, index) => {
    const pageId = 4 + index * 2;
    const contentId = 5 + index * 2;
    const textLines = chunk.split('\n');
    const content = [
      'BT',
      '/F1 12 Tf',
      '50 790 Td',
      ...textLines.map((line, lineIndex) =>
        `${lineIndex === 0 ? '' : '0 -20 Td ' }(${escapePdfText(line)}) Tj`.trim()
      ),
      'ET',
    ].join('\n');

    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >> endobj`
    );
    objects.push(`${contentId} 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`);
  });

  let pdf = '%PDF-1.4\n';
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

export const fetchMyAstroReports = async (userId: string): Promise<AstroReportRecord[]> => {
  const response = await fetch(`/api/astro-reports?userId=${encodeURIComponent(userId)}`);
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to load reports');
  }
  return data as AstroReportRecord[];
};

export const createReportAfterPaymentSuccess = async (
  userId: string,
  profile: UserProfile | null,
  options?: {
    reportId?: string | null;
    orderId?: string | null;
    sessionId?: string | null;
  }
) => {
  const response = await fetch('/api/astro-reports/payment-success-create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      profile,
      reportId: options?.reportId || null,
      orderId: options?.orderId || null,
      sessionId: options?.sessionId || null,
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to create report request');
  }
  return data as { report: AstroReportRecord; reused: boolean };
};

export const fetchAstroReportRequirements = async (
  reportId: string,
  userId: string,
  profile: UserProfile | null
): Promise<AstroReportRequirements> => {
  const response = await fetch(`/api/astro-reports/${reportId}/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, profile }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to load report requirements');
  }
  return data as AstroReportRequirements;
};

export const submitAstroReportInputs = async (
  reportId: string,
  payload: {
    userId: string;
    profile: UserProfile | null;
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    birthPlace: string;
    gender: UserProfile['gender'];
    preferredLanguage: 'si';
    palmImageBase64: string;
    palmImageMimeType: string;
    palmQuality: {
      width: number;
      height: number;
      brightness: number;
      contrast: number;
      sharpness: number;
    };
  }
) => {
  const response = await fetch(`/api/astro-reports/${reportId}/inputs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to submit report inputs');
  }
  return data as { report: AstroReportRecord };
};

export const fetchAstroReport = async (reportId: string, userId: string): Promise<AstroReportRecord> => {
  const response = await fetch(`/api/astro-reports/${reportId}?userId=${encodeURIComponent(userId)}`);
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'Unable to load report');
  }
  return data as AstroReportRecord;
};

export const downloadAstroReportPdf = async (report: AstroReportRecord) => {
  if (!report.reportJson) {
    throw new Error('Report is not ready yet');
  }

  const sections = [
    report.reportJson.coverSection,
    report.reportJson.coreAstroProfile,
    report.reportJson.personalityLifeBlueprint,
    report.reportJson.wealthCareerBusinessReport,
    report.reportJson.loveMarriageRelationshipReport,
    report.reportJson.healthLifestyleGuidance,
    report.reportJson.dashaTimePeriodAnalysis,
    report.reportJson.yogasDoshasPlanetaryInfluences,
    report.reportJson.palmAnalysisReport,
    report.reportJson.upcomingNekathForUser,
    report.reportJson.pastLifeLine,
    report.reportJson.recommendedGemsToWear,
    report.reportJson.fullRemediesReport,
    report.reportJson.personalizedRecommendations,
    report.reportJson.finalThoughtSummary,
    report.reportJson.endRecommendationsSection,
  ];

  const blob = createSimplePdfBlob(
    `${report.inputSnapshot?.fullName || 'Wishwaya'} Premium Astrology Report`,
    sections
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wishwaya-report-${report.id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

export const getReportStatusLabel = (status: AstroReportStatus) => {
  switch (status) {
    case 'draft':
    case 'awaiting_payment':
      return 'Awaiting Payment';
    case 'paid':
      return 'Pending';
    case 'collecting_inputs':
      return 'Pending';
    case 'queued':
    case 'generating':
    case 'pdf_generating':
      return 'Pending';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
};
