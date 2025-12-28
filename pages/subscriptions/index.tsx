import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Check } from 'phosphor-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly?: number;
  features: string[];
}

export default function SubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/subscriptions');
      return;
    }

    if (status === 'authenticated') {
      fetchPlans();
    }
  }, [status, router]);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/subscriptions/plans');
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      signIn('google', { callbackUrl: '/subscriptions' });
      return;
    }

    setProcessing(planId);
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        // Redirect to Razorpay subscription checkout page
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.message || 'Failed to create subscription');
        setProcessing(null);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('An error occurred. Please try again.');
      setProcessing(null);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#171739] mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect subscription for your pet parenting journey
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white p-1 rounded-lg border-2 border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#FFD447] text-[#171739]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-[#FFD447] text-[#171739]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-sm text-green-600">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = billingCycle === 'yearly' && plan.price_yearly
              ? plan.price_yearly
              : plan.price_monthly;
            const monthlyEquivalent = billingCycle === 'yearly' && plan.price_yearly
              ? Math.round(plan.price_yearly / 12)
              : plan.price_monthly;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-[#FFD447] transition-all"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#171739] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#171739]">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-500">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price_yearly && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(monthlyEquivalent)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(plan.features as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processing === plan.id}
                  className="w-full px-6 py-3 bg-[#FFD447] text-[#171739] font-bold rounded-lg hover:bg-[#FFC820] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === plan.id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No subscription plans available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

