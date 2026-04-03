import React, { useEffect, useState } from 'react';
import { ManualPaymentFeature, ManualPaymentRequest } from '../src/types';
import {
  deleteManualPayment,
  fetchManualPayments,
  reviewManualPayment,
} from '../src/services/manualPaymentClient';

interface ManualPaymentReviewPanelProps {
  adminEmail: string;
  feature: ManualPaymentFeature;
  title: string;
}

const ManualPaymentReviewPanel: React.FC<ManualPaymentReviewPanelProps> = ({
  adminEmail,
  feature,
  title,
}) => {
  const [requests, setRequests] = useState<ManualPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await fetchManualPayments({
        adminEmail,
        feature,
      });
      setRequests(rows);
      setError(null);
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to load bank transfer requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [adminEmail, feature]);

  const handleDecision = async (requestId: string, decision: 'approve' | 'reject') => {
    setBusyId(requestId);
    try {
      await reviewManualPayment({
        requestId,
        adminEmail,
        decision,
      });
      await load();
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to update request');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (requestId: string) => {
    setBusyId(requestId);
    try {
      await deleteManualPayment({
        requestId,
        adminEmail,
      });
      await load();
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to delete request');
    } finally {
      setBusyId(null);
    }
  };

  const getStatusTone = (status: ManualPaymentRequest['status']) => {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-700';
    if (status === 'rejected') return 'bg-red-50 text-red-600';
    return 'bg-amber-50 text-amber-700';
  };

  const buildDecisionMeta = (request: ManualPaymentRequest) => {
    if (request.status === 'approved' && request.approvedBy) {
      return `Approved by ${request.approvedBy}${request.approvedAt ? ` on ${new Date(request.approvedAt).toLocaleString('en-CA')}` : ''}`;
    }
    if (request.status === 'rejected' && request.rejectedBy) {
      return `Rejected by ${request.rejectedBy}${request.rejectedAt ? ` on ${new Date(request.rejectedAt).toLocaleString('en-CA')}` : ''}`;
    }
    return null;
  };

  return (
    <div className="rounded-[2rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Admin Review</p>
          <h4 className="mt-1 text-lg font-black text-slate-900">{title}</h4>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700"
        >
          Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-500">No bank transfer requests yet.</div>
        ) : (
          requests.map((request) => {
            const decisionMeta = buildDecisionMeta(request);

            return (
              <div key={request.id} className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">{request.featureLabel}</p>
                    <p className="text-xs text-slate-500">
                      User {request.userId} • {request.currency} {request.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${getStatusTone(request.status)}`}>
                      {request.status}
                    </span>
                    <a
                      href={`${request.slipUrl}?adminEmail=${encodeURIComponent(adminEmail)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                    >
                      View Slip
                    </a>
                  </div>
                </div>

                {(request.paymentReference || request.note) && (
                  <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-6 text-slate-600">
                    {request.paymentReference ? `Reference: ${request.paymentReference}` : 'Reference: -'}
                    <br />
                    {request.note ? `Note: ${request.note}` : 'Note: -'}
                  </div>
                )}

                {decisionMeta && (
                  <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-6 text-slate-600">
                    {decisionMeta}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  {request.status === 'submitted' && (
                    <>
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() => void handleDecision(request.id, 'approve')}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-70"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() => void handleDecision(request.id, 'reject')}
                        className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:opacity-70"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={busyId === request.id}
                    onClick={() => void handleDelete(request.id)}
                    className="rounded-full bg-slate-200 px-4 py-2 text-xs font-black text-slate-700 disabled:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManualPaymentReviewPanel;
