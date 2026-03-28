import React, { useState } from 'react';

interface StripeCheckoutButtonProps {
  className?: string;
  label?: string;
  customerEmail?: string | null;
}

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  className = 'w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white shadow-lg shadow-slate-300',
  label = 'Pay with Stripe',
  customerEmail = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create Stripe checkout session');
      }

      if (!data?.checkoutUrl) {
        throw new Error('Stripe checkout URL was not returned');
      }

      window.location.href = data.checkoutUrl;
    } catch (nextError: any) {
      setError(nextError?.message || 'Stripe checkout could not be started');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => void handleClick()} disabled={loading} className={`${className} disabled:opacity-70`}>
        {loading ? 'Opening Stripe...' : label}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default StripeCheckoutButton;
