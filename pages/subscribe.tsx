import { useEffect } from "react";

export default function SubscribePage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const payNow = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 4299 }),
    });

    const order = await res.json();

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!razorpayKeyId) {
      alert("Razorpay key is not configured. Please check your environment variables.");
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: "INR",
      name: "Pet.Ra",
      description: "Wag Plus Subscription",
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const result = await verifyRes.json();
        if (result.success) {
          alert("Payment successful");
        } else {
          alert("Payment verification failed");
        }
      },
      theme: { color: "#171739" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <button
        onClick={payNow}
        className="px-8 py-4 bg-[#FFD447] text-[#171739] font-bold rounded-xl"
      >
        Subscribe Now
      </button>
    </div>
  );
}
