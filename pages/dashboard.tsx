import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { User, CreditCard, Calendar, X } from 'phosphor-react';

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  subscription_plans: {
    name: string;
    description: string;
    price_monthly: number;
    features: string[];
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }

    if (status === 'authenticated') {
      fetchSubscription();
    }
  }, [status, router]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions/my-subscription');
      const data = await res.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-[#171739]">
                  Welcome, {session?.user?.name || 'User'}!
                </h1>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Subscription Status */}
        {subscription ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-[#FFD447]" />
              <h2 className="text-xl font-bold text-[#171739]">Active Subscription</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#171739] mb-2">
                  {subscription.subscription_plans.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {subscription.subscription_plans.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Period</p>
                    <p className="font-semibold text-[#171739]">
                      {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-green-600 capitalize">
                      {subscription.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-[#171739] mb-3">Plan Features:</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  {(subscription.subscription_plans.features as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-[#FFD447] rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#171739] mb-2">
              No Active Subscription
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to a plan to unlock premium features
            </p>
            <button
              onClick={() => router.push('/subscriptions')}
              className="px-6 py-3 bg-[#FFD447] text-[#171739] font-bold rounded-lg hover:bg-[#FFC820] transition-colors"
            >
              Browse Plans
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/subscriptions')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
          >
            <CreditCard className="w-8 h-8 text-[#FFD447] mb-3" />
            <h3 className="font-semibold text-[#171739] mb-2">Manage Subscription</h3>
            <p className="text-sm text-gray-600">
              View or change your subscription plan
            </p>
          </button>

          <button
            onClick={() => router.push('/pet-parent-guide')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
          >
            <User className="w-8 h-8 text-[#FFD447] mb-3" />
            <h3 className="font-semibold text-[#171739] mb-2">Pet Parent Guide</h3>
            <p className="text-sm text-gray-600">
              Access your personalized pet care guides
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

