"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function UpgradeModal({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-sm w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 text-xl"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-white mb-2">Upgrade to Unlimited</h2>
          <p className="text-gray-400 text-sm">
            Unlimited README generations for just <strong className="text-white">$9/month</strong>.
            Cancel anytime.
          </p>
        </div>
        <ul className="space-y-2 mb-6 text-sm text-gray-400">
          {["Unlimited generations", "Priority AI processing", "Early access to new features"].map(
            (f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> {f}
              </li>
            )
          )}
        </ul>
        <input
          type="email"
          placeholder="your@email.com (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-600 transition-colors text-sm mb-4"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {loading ? "Redirecting to checkout…" : "Upgrade for $9/mo"}
        </button>
        <p className="text-xs text-gray-600 text-center mt-3">Powered by Stripe · Secure checkout</p>
      </div>
    </div>
  );
}
