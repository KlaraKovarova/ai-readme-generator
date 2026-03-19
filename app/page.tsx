import type { Metadata } from "next";
import Generator from "@/components/Generator";

export const metadata: Metadata = {
  title: "ReadmeGen – AI-powered README generator",
  description:
    "Paste a GitHub URL and get a professional README.md in seconds. Powered by AI. Free for 3 generations.",
  openGraph: {
    title: "ReadmeGen – AI-powered README generator",
    description: "Paste a GitHub URL and get a professional README.md in seconds.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            Readme<span className="text-indigo-400">Gen</span>
          </span>
          <span className="text-sm text-gray-500">3 free · $9/mo unlimited</span>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            README in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              seconds
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Paste any GitHub repo URL. AI analyses the codebase and writes a professional README.md.
            Edit and download.
          </p>
        </div>
        <Generator />
      </div>

      <footer className="border-t border-gray-800 py-8 mt-16 text-center text-xs text-gray-600">
        <p>
          Powered by{" "}
          <a
            href="https://anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Claude AI
          </a>
          {" · "}
          Your data is never stored
        </p>
        <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://buymeacoffee.com/klarakovarova"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-500 text-gray-900 text-xs font-medium hover:bg-yellow-400 transition-colors"
          >
            ☕ Support this project
          </a>
          <a
            href="https://www.binance.com/register?ref=12852887"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-yellow-500/30 text-yellow-500 text-xs font-medium hover:bg-yellow-500/10 transition-colors"
          >
            🪙 Try Binance
          </a>
        </div>
      </footer>
    </main>
  );
}
