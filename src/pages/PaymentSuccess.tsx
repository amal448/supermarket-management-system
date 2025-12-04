// File: src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setMessage("No session id provided.");
        setLoading(false);
        return;
      }

      try {
        // Optional: verify session with backend (recommended)
        const res = await fetch(`/api/payments/verify-session?session_id=${sessionId}`);
        const json = await res.json();

        if (res.ok) {
          setMessage(json.message || "Payment confirmed. Thank you!");
        } else {
          setMessage(json.message || "Payment could not be verified.");
        }
      } catch (err) {
        setMessage("Failed to verify payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-green-600">Payment Successful</h1>
        <p className="mt-4 text-sm text-gray-600">Your payment has been processed.</p>

        {loading ? (
          <p className="mt-6">Verifying payment…</p>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-700">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/sales-history")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-lg border border-gray-200"
              >
                Back to Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

