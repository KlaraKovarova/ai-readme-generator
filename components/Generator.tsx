"use client";

import { useState, useCallback } from "react";
import UpgradeModal from "./UpgradeModal";
import { DEMO_FILE_TREE, DEMO_README, DEMO_REPO_URL } from "@/lib/demo";

const DAILY_KEY = "readme_gen_daily";
const FREE_LIMIT = 5;

function getUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem(DAILY_KEY) ?? "null") as { count: number; date: string } | null;
    return stored?.date === today ? stored.count : 0;
  } catch {
    return 0;
  }
}

function incrementUsage(): number {
  const today = new Date().toISOString().split("T")[0];
  const count = getUsage() + 1;
  localStorage.setItem(DAILY_KEY, JSON.stringify({ count, date: today }));
  return count;
}

export default function Generator() {
  const [repoUrl, setRepoUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showByok, setShowByok] = useState(false);
  const [readme, setReadme] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usage, setUsage] = useState<number | null>(null);

  const generate = useCallback(async (url?: string) => {
    const target = (url ?? repoUrl).trim();
    if (!target) return;
    const currentUsage = getUsage();
    if (currentUsage >= FREE_LIMIT && !apiKey.trim()) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError("");
    setReadme("");
    setIsDemo(false);

    try {
      const body: { repoUrl: string; apiKey?: string } = { repoUrl: target };
      if (apiKey.trim()) body.apiKey = apiKey.trim();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { readme?: string; error?: string; demo?: boolean };
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setReadme(data.readme ?? "");
      setIsDemo(data.demo ?? false);
      const newUsage = incrementUsage();
      setUsage(newUsage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [repoUrl]);

  function tryDemo() {
    setRepoUrl(DEMO_REPO_URL);
    generate(DEMO_REPO_URL);
  }

  function download() {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  const usageCount = usage ?? getUsage();
  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Before/after demo showcase */}
      <div className="mb-12">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            See it in action
          </span>
          <h2 className="text-xl font-semibold text-white mt-1">
            Repo structure → polished README
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Paste any GitHub URL and get output like this in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-gray-800">
          {/* Left: repo structure */}
          <div className="bg-gray-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 ml-2 font-mono">axios/axios — file tree</span>
            </div>
            <pre className="text-xs text-gray-400 font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre">
              {DEMO_FILE_TREE}
            </pre>
          </div>

          {/* Right: generated README */}
          <div className="bg-gray-900 border-l border-gray-800 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-gray-500">README.md</span>
              <span className="ml-auto text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full">
                AI generated
              </span>
            </div>
            <pre className="text-xs text-gray-300 font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre-wrap flex-1">
              {DEMO_README.slice(0, 800)}…
            </pre>
            <button
              onClick={tryDemo}
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              {loading ? "Generating…" : "Try it — generate full README →"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="block text-sm text-gray-400 mb-2" htmlFor="repo-url">
            GitHub repository URL
          </label>
          <div className="flex gap-3">
            <input
              id="repo-url"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="https://github.com/owner/repo"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-600 transition-colors text-sm"
            />
            <button
              onClick={() => generate()}
              disabled={loading || !repoUrl.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </span>
              ) : (
                "Generate README"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {remaining > 0
              ? `${remaining} free generation${remaining !== 1 ? "s" : ""} remaining today`
              : "Daily free limit reached — "}
            {remaining === 0 && !apiKey.trim() && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                upgrade for $5/mo
              </button>
            )}
          </p>

          {/* BYOK toggle */}
          <div className="mt-4 border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={() => setShowByok((v) => !v)}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <span className={`transition-transform ${showByok ? "rotate-90" : ""}`}>▶</span>
              Use your own Anthropic API key
            </button>

            {showByok && (
              <div className="mt-3 space-y-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-…"
                  autoComplete="off"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-600 transition-colors text-sm font-mono"
                />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your key is sent directly to the API for this request only — it is never logged, stored, or shared.
                  Using your own key bypasses the free-generation limit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Output */}
        {readme && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">README.md</span>
                {isDemo && (
                  <span className="text-xs bg-amber-900/60 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full">
                    Demo output — use your own API key for live generation
                  </span>
                )}
              </div>
              <button
                onClick={download}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                ↓ Download
              </button>
            </div>
            <textarea
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
              className="w-full bg-transparent text-gray-300 font-mono text-xs leading-relaxed p-6 min-h-[500px] resize-y focus:outline-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* Cross-promote other tools */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/50">
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
            More AI developer tools
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://codereview-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet-400 hover:text-violet-300 bg-violet-950/50 border border-violet-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              CodeReview·AI — instant code review
            </a>
            <a
              href="https://testgen-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              TestGen·AI — unit test generator
            </a>
            <a
              href="https://commitcraft-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              CommitCraft·AI — commit message generator
            </a>
            <a
              href="https://envgen-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              EnvGen·AI — .env file generator
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
