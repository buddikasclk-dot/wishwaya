import React from 'react';
import ManualPaymentReviewPanel from './ManualPaymentReviewPanel';

interface SuperAdminDashboardProps {
  adminEmail: string;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ adminEmail }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-[2.6rem] border border-amber-200 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_34%),linear-gradient(160deg,_#fffdf5_0%,_#fff8e7_50%,_#fffef8_100%)] p-6 shadow-[0_24px_60px_rgba(245,158,11,0.12)]">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-100/50 blur-2xl" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Super Admin</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Payment Review Dashboard</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Review bank transfer slips, approve payments, reject invalid submissions, and keep room for future admin tools.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-white/85 px-4 py-2 text-xs font-black text-slate-700 shadow-sm">
            {adminEmail}
          </div>
        </div>
      </section>

      <div className="grid gap-5">
        <ManualPaymentReviewPanel
          adminEmail={adminEmail}
          feature="full_astro_report"
          title="Premium report bank transfer approvals"
        />
        <ManualPaymentReviewPanel
          adminEmail={adminEmail}
          feature="consultant_starter_200"
          title="Basic consultant bank transfer approvals"
        />
        <ManualPaymentReviewPanel
          adminEmail={adminEmail}
          feature="consultant_premium_500"
          title="Premium consultant bank transfer approvals"
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
