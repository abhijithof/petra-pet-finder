import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const razorpaySignature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!razorpaySignature || !webhookSecret) {
      return res.status(400).json({ message: 'Missing signature or secret' });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    switch (event) {
      case 'subscription.activated':
      case 'subscription.charged':
        await handleSubscriptionCharged(payload.subscription.entity);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.subscription.entity);
        break;

      case 'subscription.paused':
        await handleSubscriptionPaused(payload.subscription.entity);
        break;

      case 'subscription.resumed':
        await handleSubscriptionResumed(payload.subscription.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleSubscriptionCharged(subscription: any) {
  const { data: dbSub } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('razorpay_subscription_id', subscription.id)
    .single();

  if (dbSub) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date(subscription.current_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbSub.id);
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionPaused(subscription: any) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'paused',
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionResumed(subscription: any) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handlePaymentCaptured(payment: any) {
  const { data: dbSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, id')
    .eq('razorpay_subscription_id', payment.subscription_id)
    .single();

  if (dbSub) {
    await supabaseAdmin
      .from('payments')
      .insert({
        user_id: dbSub.user_id,
        subscription_id: dbSub.id,
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'succeeded',
        payment_method: payment.method,
      });
  }
}

async function handlePaymentFailed(payment: any) {
  const { data: dbSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, id')
    .eq('razorpay_subscription_id', payment.subscription_id)
    .single();

  if (dbSub) {
    await supabaseAdmin
      .from('payments')
      .insert({
        user_id: dbSub.user_id,
        subscription_id: dbSub.id,
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'failed',
        payment_method: payment.method,
      });

    // Update subscription status if payment failed
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbSub.id);
  }
}

