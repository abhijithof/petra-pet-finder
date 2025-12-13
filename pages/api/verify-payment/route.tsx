import crypto from "crypto";
import { NextResponse } from "next/server";

interface RazorpayVerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(req: Request) {
  const body: RazorpayVerifyBody = await req.json();

  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(payload)
    .digest("hex");

  const isAuthentic = expectedSignature === body.razorpay_signature;

  if (!isAuthentic) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Strategic hook: DB write / subscription activation
  return NextResponse.json({ success: true });
}
