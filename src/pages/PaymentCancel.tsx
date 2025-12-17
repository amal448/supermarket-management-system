
// File: src/pages/PaymentCancel.jsx
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-amber-600">Payment Cancelled</h1>
        <p className="mt-4 text-sm text-gray-600">Your payment was cancelled or not completed.</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg border border-gray-200"
          >
            Back to Shop
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>If you think this is an error, check your order history or contact support.</p>
        </div>
      </div>
    </div>
  );
}

