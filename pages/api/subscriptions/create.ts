import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth/next';
import { supabaseAdmin } from '../../../lib/supabase';
import { authOptions } from '../auth/[...nextauth]';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { planId, billingCycle } = req.body; // billingCycle: 'monthly' | 'yearly'

    // Get plan details
    const { data: plan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Get or create Razorpay customer
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    let razorpayCustomerId = profile?.razorpay_customer_id;

    if (!razorpayCustomerId) {
      // Create Razorpay customer
      const customer = await razorpay.customers.create({
        name: profile?.full_name || session.user.email || 'User',
        email: session.user.email || undefined,
        contact: profile?.phone || undefined,
      });
      razorpayCustomerId = customer.id;

      // Update profile with customer ID
      await supabaseAdmin
        .from('profiles')
        .update({ razorpay_customer_id: razorpayCustomerId })
        .eq('id', session.user.id);
    }

    // Create Razorpay plan if it doesn't exist
    let razorpayPlanId = plan.razorpay_plan_id;
    const price = billingCycle === 'yearly' && plan.price_yearly 
      ? plan.price_yearly 
      : plan.price_monthly;
    const interval = billingCycle === 'yearly' ? 12 : 1;

    if (!razorpayPlanId) {
      const razorpayPlan = await razorpay.plans.create({
        period: 'monthly',
        interval: interval,
        item: {
          name: plan.name,
          amount: price,
          currency: 'INR',
        },
      });
      razorpayPlanId = razorpayPlan.id;

      // Update plan with Razorpay plan ID
      await supabaseAdmin
        .from('subscription_plans')
        .update({ razorpay_plan_id: razorpayPlanId })
        .eq('id', planId);
    }

    // Create Razorpay subscription (pending authentication)
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: billingCycle === 'yearly' ? 12 : 999, // 999 for indefinite monthly
      start_at: Math.floor(Date.now() / 1000) + 60, // Start in 1 minute
      notes: {
        user_id: session.user.id,
        plan_id: planId,
      },
    });

    // Save subscription to database with pending status
    // Status will be updated to 'active' via webhook after payment
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { data: dbSubscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: session.user.id,
        plan_id: planId,
        razorpay_subscription_id: subscription.id,
        razorpay_customer_id: razorpayCustomerId,
        status: 'pending', // Will be activated via webhook
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error('Error saving subscription:', subError);
      return res.status(500).json({ message: 'Failed to save subscription' });
    }

    // Return subscription details for frontend to open Razorpay checkout
    res.status(200).json({
      subscription: dbSubscription,
      razorpaySubscription: subscription,
      checkoutUrl: subscription.short_url, // Razorpay checkout URL
    });
  } catch (err: any) {
    console.error('Error creating subscription:', err);
    res.status(500).json({ 
      error: 'Subscription creation failed',
      message: err.message 
    });
  }
}

