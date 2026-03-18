import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment successful – ReadmeGen",
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-4">You&apos;re all set!</h1>
        <p className="text-gray-400 mb-8">
          Your subscription is active. You now have unlimited README generations per month.
          Come back here and start generating!
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Start generating
        </Link>
      </div>
    </main>
  );
}
