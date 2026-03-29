import React, { useEffect, useState } from 'react';
import { AstroReportRecord, AstroReportSection, UserProfile } from '../src/types';
import {
  createReportAfterPaymentSuccess,
  downloadAstroReportPdf,
  fetchAstroReport,
  fetchMyAstroReports,
  getReportStatusLabel,
} from '../src/services/astroReportClient';
import StripeCheckoutButton from './StripeCheckoutButton';

interface PremiumAstroReportsProps {
  profile: UserProfile;
  userId: string;
  userEmail?: string | null;
  authEnabled: boolean;
  authLoading: boolean;
  onRequireGoogleLink: () => Promise<void>;
  onSaveRequiredProfile: (profile: Pick<UserProfile, 'name' | 'gender' | 'dob' | 'birthTime' | 'city'>) => Promise<void>;
}

type FlowStep = 'closed' | 'intro' | 'includes' | 'checkout' | 'detail';

const INCLUDED_TITLES = [
  'සම්පූර්ණ ජන්ම කේන්ද්‍ර විශ්ලේෂණය',
  'ලග්නය, රාශිය, නැකත, පාද විග්‍රහය',
  'ග්‍රහ පිහිටීම් සහ භාව විග්‍රහය',
  'පෞරුෂය සහ ජීවිත මාර්ග විග්‍රහය',
  'ධන, රැකියා, ව්‍යාපාර සහ වාසනාව',
  'ආදරය, විවාහය සහ සම්බන්ධතා',
  'සෞඛ්‍ය සහ ජීවන රටා උපදෙස්',
  'දශා සහ ඉදිරි කාල පුරෝකථන',
  'යෝග, දෝෂ සහ බලපෑම්',
  'අත් රේඛා විග්‍රහය',
  'ඔබට ගැළපෙන ඉදිරි නැකත්',
  'පසුගිය ආත්ම රේඛාව',
  'පළඳින්න සුදුසු මැණික්',
  'සම්පූර්ණ පරිහාර සහ පිළියම්',
  'ජීවිතයට පුද්ගලික නිර්දේශ',
  'අවසාන සාරාංශය සහ උපදෙස්',
];

const SECTION_RENDER_ORDER: string[] = [
  'coverSection',
  'coreAstroProfile',
  'personalityLifeBlueprint',
  'wealthCareerBusinessReport',
  'loveMarriageRelationshipReport',
  'healthLifestyleGuidance',
  'dashaTimePeriodAnalysis',
  'yogasDoshasPlanetaryInfluences',
  'palmAnalysisReport',
  'upcomingNekathForUser',
  'pastLifeLine',
  'recommendedGemsToWear',
  'fullRemediesReport',
  'personalizedRecommendations',
  'finalThoughtSummary',
  'endRecommendationsSection',
];

const PremiumAstroReports: React.FC<PremiumAstroReportsProps> = ({
  profile,
  userId,
  userEmail = null,
  authEnabled,
  authLoading,
  onRequireGoogleLink,
  onSaveRequiredProfile: _onSaveRequiredProfile,
}) => {
  const normalizedEmail = (userEmail || '').trim().toLowerCase();
  const isSuperAdmin =
    normalizedEmail === '3dcafe.buddika@gmail.com' || normalizedEmail === '3dcafe.buddika@gmal.com';
  const [flowStep, setFlowStep] = useState<FlowStep>('closed');
  const [reports, setReports] = useState<AstroReportRecord[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AstroReportRecord | null>(null);
  const [pendingOpenAfterAuth, setPendingOpenAfterAuth] = useState(false);

  const refreshReports = async () => {
    setLoadingReports(true);
    try {
      const nextReports = await fetchMyAstroReports(userId);
      const visibleReports = nextReports.filter((report) => !['awaiting_payment', 'paid'].includes(report.status));
      const activeStatuses = ['collecting_inputs', 'queued', 'generating', 'pdf_generating'];
      const latestActiveReport =
        visibleReports.find((report) => activeStatuses.includes(report.status)) || null;
      const historicalReports = visibleReports.filter((report) => !activeStatuses.includes(report.status));
      setReports(latestActiveReport ? [latestActiveReport, ...historicalReports] : historicalReports);
    } catch (nextError: any) {
      setError(nextError?.message || 'Reports could not be loaded');
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    void refreshReports();
  }, [userId]);

  useEffect(() => {
    const hasActiveJob = reports.some((report) =>
      ['queued', 'generating', 'pdf_generating', 'collecting_inputs'].includes(report.status)
    );
    if (!hasActiveJob) return;

    const timer = window.setInterval(() => {
      void refreshReports();
    }, 8000);

    return () => window.clearInterval(timer);
  }, [reports]);

  useEffect(() => {
    if (!pendingOpenAfterAuth || !userEmail) return;
    setPendingOpenAfterAuth(false);
    setError(null);
    setFlowStep('checkout');
  }, [pendingOpenAfterAuth, userEmail]);

  const openReport = async (report: AstroReportRecord) => {
    setActionLoading(true);
    setError(null);
    try {
      const freshReport = await fetchAstroReport(report.id, userId);
      setSelectedReport(freshReport);
      setFlowStep('detail');
    } catch (nextError: any) {
      setError(nextError?.message || 'Report could not be opened');
    } finally {
      setActionLoading(false);
    }
  };

  const openPdfSource = (report: AstroReportRecord) => {
    window.open(
      `/api/astro-reports/${report.id}/pdf?userId=${encodeURIComponent(userId)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const openPremiumFlow = async () => {
    setError(null);
    setFlowStep('intro');
  };

  const handleOptionalGoogleSignIn = async () => {
    if (authLoading) return;
    setActionLoading(true);
    setError(null);
    setPendingOpenAfterAuth(true);
    try {
      await onRequireGoogleLink();
    } catch (nextError: any) {
      setPendingOpenAfterAuth(false);
      setError(nextError?.message || 'Google account linking failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartAdminReport = async () => {
    if (!userId) return;
    setActionLoading(true);
    setError(null);
    try {
      const result = await createReportAfterPaymentSuccess(userId, profile || null);
      setFlowStep('closed');
      window.location.href = `/payment-success?reportId=${encodeURIComponent(result.report.id)}`;
    } catch (nextError: any) {
      setError(nextError?.message || 'Admin report request could not be started.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderSection = (section: AstroReportSection) => (
    <section key={section.key} className="rounded-[2rem] border border-emerald-100/60 bg-white/75 p-5 shadow-sm">
      <h4 className="text-base font-black text-slate-800">{section.title}</h4>
      <div className="mt-3 space-y-3 text-[13px] leading-7 text-slate-600 sinhala">
        {section.content
          .split('\n')
          .filter(Boolean)
          .map((line, index) => (
            <p key={`${section.key}-${index}`}>{line}</p>
          ))}
      </div>
    </section>
  );

  const latestReport = reports[0] || null;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2.8rem] border border-emerald-100 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.34),_transparent_34%),radial-gradient(circle_at_right,_rgba(96,165,250,0.20),_transparent_30%),linear-gradient(140deg,_#ffffff_0%,_#eefbf5_42%,_#ecf6ff_100%)] p-7 text-left shadow-[0_24px_70px_rgba(16,185,129,0.12)]">
        <div className="absolute -top-8 right-6 h-24 w-24 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
                <span>✦</span>
                <span>PREMIUM ASTRO REPORT</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">ජෝතීශ්‍යට අනුව ඔබේ සම්පුර්ණ වර්තාව ලබාගන්න</h3>
              <p className="sinhala text-sm leading-6 text-slate-600">ඔබ ගැන සම්පූර්ණ ජෝතිශ්‍ය විග්‍රහය ලබාගන්න</p>
            </div>
            <div className="rounded-full border border-emerald-100 bg-white/85 px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
              Pro Version - රු. 300/-
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">සිංහල PDF වාර්තාව</span>
            <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">One-time purchase</span>
            <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">Palm analysis included</span>
          </div>

          <p className="sinhala max-w-xl text-sm leading-7 text-slate-600">
            ඔබගේ උපන් තොරතුරු, ජන්ම කේන්ද්‍රය, අත් රේඛා සහ පුද්ගලික ජීවිත රටාවන් පදනම් කරගෙන
            සවිස්තරාත්මක සිංහල ජෝතිශ්‍ය වාර්තාවක් ලබාගන්න.
          </p>

          <button
            type="button"
            onClick={() => void openPremiumFlow()}
            disabled={actionLoading || authLoading}
            className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-[linear-gradient(135deg,_#0f172a_0%,_#144b5f_48%,_#0f766e_100%)] px-6 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {actionLoading || authLoading ? 'Please wait...' : 'සම්පූර්ණ වාර්තාව ලබාගන්න'}
          </button>
        </div>
      </div>

      <div className="rounded-[2.4rem] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">වාර්තා</p>
            <h3 className="mt-1 text-lg font-black text-slate-900">මගේ Premium වාර්තා</h3>
          </div>
          {latestReport && (
            <div className={`rounded-full px-3 py-1 text-[11px] font-black ${latestReport.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : latestReport.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'}`}>
              {getReportStatusLabel(latestReport.status)}
            </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {loadingReports ? (
            <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-500">Premium වාර්තා පූරණය වෙමින් පවතී...</div>
          ) : reports.length === 0 ? (
            <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-500">
              තවම premium වාර්තා නොමැත. ඉහළ card එකෙන් ඔබගේ පළමු සිංහල වාර්තාව ලබාගන්න.
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">{report.inputSnapshot?.fullName || profile.name}</p>
                    <p className="text-[12px] text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString('en-CA')} • Request ID {report.requestId}
                    </p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-[11px] font-black ${report.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : report.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'}`}>
                    {getReportStatusLabel(report.status)}
                  </div>
                </div>

                {report.failureReason && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-[12px] leading-6 text-red-600">{report.failureReason}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {report.status === 'collecting_inputs' && (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = `/payment-success?reportId=${encodeURIComponent(report.id)}`;
                      }}
                      className="rounded-full bg-slate-900 px-4 py-2 text-[12px] font-black text-white"
                    >
                      Complete Details
                    </button>
                  )}
                  {report.status === 'completed' && (
                    <>
                      <button type="button" onClick={() => void openReport(report)} className="rounded-full bg-slate-900 px-4 py-2 text-[12px] font-black text-white">
                        View Report
                      </button>
                      <button type="button" onClick={() => void downloadAstroReportPdf(report)} className="rounded-full bg-emerald-100 px-4 py-2 text-[12px] font-black text-emerald-800">
                        PDF බාගත කරන්න
                      </button>
                      <button type="button" onClick={() => openPdfSource(report)} className="rounded-full bg-white px-4 py-2 text-[12px] font-black text-slate-700">
                        මුද්‍රණ දසුන බලන්න
                      </button>
                    </>
                  )}
                  {report.status !== 'completed' && report.status !== 'failed' && report.status !== 'collecting_inputs' && (
                    <div className="rounded-full bg-slate-900 px-4 py-2 text-[12px] font-black text-white">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(flowStep !== 'closed' || !!error) && (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2.8rem] border border-white/70 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_32%),linear-gradient(180deg,_#f8fffb_0%,_#f4fbff_100%)] p-6 pb-24 text-slate-800 shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <button
              type="button"
              onClick={() => {
                setFlowStep('closed');
                setError(null);
                setSelectedReport(null);
              }}
              className="absolute right-5 top-5 rounded-full bg-slate-900 px-3 py-2 text-xs font-black text-white"
            >
              Close
            </button>

            {error && (
              <div className="mb-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {flowStep === 'intro' && (
              <div className="space-y-6 pr-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600">හැඳින්වීම</p>
                  <h3 className="text-3xl font-black text-slate-900">ජෝතීශ්‍යට අනුව ඔබේ සම්පුර්ණ වර්තාව ලබාගන්න</h3>
                </div>
                <p className="sinhala text-sm leading-8 text-slate-600">
                  ඔබගේ උපන් තොරතුරු, ජන්ම කේන්ද්‍රය, අත් රේඛා සහ පුද්ගලික ජීවිත රටාවන් පදනම් කරගෙන
                  සවිස්තරාත්මක සිංහල ජෝතිශ්‍ය වාර්තාවක් ලබාගන්න.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[2rem] border border-emerald-100 bg-white/80 p-5 shadow-sm">
                    <p className="text-sm font-black text-slate-800 sinhala">ඔබට ලැබෙන්නේ</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sinhala">සම්පූර්ණ සිංහල වාර්තාව, අත් රේඛා විග්‍රහය, පුද්ගලික පරිහාර සහ පසුව ඔබගේ ගිණුම තුළින් නැවත බැලීමේ හැකියාව.</p>
                  </div>
                  <div className="rounded-[2rem] border border-sky-100 bg-white/80 p-5 shadow-sm">
                    <p className="text-sm font-black text-slate-800 sinhala">මිල සහ කාලය</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sinhala">රු. 300/- එක්වර ගෙවීමක් පමණි. PDF බාගත කිරීම ඇතුළත්ය.</p>
                  </div>
                </div>
                <div className="sticky bottom-0 -mx-2 bg-gradient-to-t from-[#f4fbff] via-[#f4fbff] to-transparent px-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setFlowStep('includes')}
                    className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white shadow-lg shadow-slate-300"
                  >
                    ඇතුළත් දෑ බලන්න
                  </button>
                </div>
              </div>
            )}

            {flowStep === 'includes' && (
              <div className="space-y-6 pr-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600">ඇතුළත් දෑ</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900 sinhala">ඔබට ලැබෙන සම්පූර්ණ Premium කොටස්</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {INCLUDED_TITLES.map((item) => (
                    <div key={item} className="rounded-[1.6rem] border border-emerald-100 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
                      ✦ {item}
                    </div>
                  ))}
                </div>
                <div className="sticky bottom-0 -mx-2 bg-gradient-to-t from-[#f4fbff] via-[#f4fbff] to-transparent px-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setFlowStep('checkout')}
                    className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white shadow-lg shadow-slate-300"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {flowStep === 'checkout' && (
              <div className="space-y-6 pr-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600">ගෙවීම</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900 sinhala">Premium වාර්තා ගෙවීම</h3>
                </div>
                <div className="rounded-[2rem] border border-emerald-100 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-black text-slate-900 sinhala">සම්පූර්ණ සිංහල ජෝතිශ්‍ය වාර්තාව</p>
                      <p className="mt-2 text-sm text-slate-600 sinhala">එක්වර ගෙවීමක් පමණි. වාර්තාව PDF ලෙස බාගත කළ හැක.</p>
                      <p className="mt-2 text-xs font-semibold text-slate-500">App price: Rs. 300/-</p>
                    </div>
                    <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white shadow-lg shadow-slate-300">
                      Rs. 300/-
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700 sinhala">සම්පූර්ණ සිංහල ජෝතිශ්‍ය වාර්තාව</div>
                    <div className="rounded-2xl bg-sky-50 p-4 text-sm text-slate-700 sinhala">අත් රේඛා විග්‍රහය</div>
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700 sinhala">පුද්ගලික පරිහාර සහ නිර්දේශ</div>
                    <div className="rounded-2xl bg-sky-50 p-4 text-sm text-slate-700 sinhala">PDF බාගත කිරීම</div>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-sky-100 bg-sky-50/70 p-5 text-sm leading-7 text-slate-600">
                  Pay securely with Stripe.
                </div>
                {authEnabled && !userEmail && (
                  <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-5 shadow-sm">
                    <p className="text-sm font-black text-slate-800">Optional</p>
                    <p className="mt-2 sinhala text-sm leading-7 text-slate-600">
                      Google සමග ගිනුම ආරම්භ කරන්න. එවිට Stripe checkout එකේ ඔබගේ email එක පුරවා දිස්වේ.
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleOptionalGoogleSignIn()}
                      disabled={actionLoading || authLoading}
                      className="mt-4 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-800 disabled:opacity-70"
                    >
                      {actionLoading || authLoading ? 'Please wait...' : 'Google සමග ගිනුම ආරම්භ කරන්න'}
                    </button>
                  </div>
                )}
                <div className="sticky bottom-0 -mx-2 space-y-3 bg-gradient-to-t from-[#f4fbff] via-[#f4fbff] to-transparent px-2 pt-5">
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => void handleStartAdminReport()}
                      disabled={actionLoading}
                      className="w-full rounded-full bg-emerald-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-200 disabled:opacity-70"
                    >
                      {actionLoading ? 'Please wait...' : 'Start Report (Super Admin - No Payment)'}
                    </button>
                  )}
                  {!isSuperAdmin && <StripeCheckoutButton label="Pay with Stripe" customerEmail={userEmail} />}
                </div>
              </div>
            )}

            {flowStep === 'detail' && selectedReport?.reportJson && (
              <div className="space-y-6 pr-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600">Premium වාර්තාව</p>
                    <h3 className="mt-2 text-3xl font-black text-slate-900">{selectedReport.inputSnapshot?.fullName}</h3>
                    <p className="mt-2 text-sm text-slate-500">සකස් කළේ {new Date(selectedReport.updatedAt).toLocaleString('en-CA')}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => void downloadAstroReportPdf(selectedReport)} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300">
                      PDF බාගත කරන්න
                    </button>
                    <button type="button" onClick={() => openPdfSource(selectedReport)} className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
                      මුද්‍රණ දසුන බලන්න
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {SECTION_RENDER_ORDER.map((key) =>
                    renderSection(selectedReport.reportJson?.[key as keyof typeof selectedReport.reportJson] as AstroReportSection)
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumAstroReports;
