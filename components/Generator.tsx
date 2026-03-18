"use client";

import { useState, useCallback } from "react";
import UpgradeModal from "./UpgradeModal";

const STORAGE_KEY = "readme_gen_usage";
const FREE_LIMIT = 3;

function getUsage(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
}

function incrementUsage(): number {
  const next = getUsage() + 1;
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

export default function Generator() {
  const [repoUrl, setRepoUrl] = useState("");
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usage, setUsage] = useState<number | null>(null);

  const generate = useCallback(async () => {
    if (!repoUrl.trim()) return;
    const currentUsage = getUsage();
    if (currentUsage >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError("");
    setReadme("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });
      const data = await res.json() as { readme?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setReadme(data.readme ?? "");
      const newUsage = incrementUsage();
      setUsage(newUsage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [repoUrl]);

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
              onClick={generate}
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
              ? `${remaining} free generation${remaining !== 1 ? "s" : ""} remaining`
              : "Free limit reached — "}
            {remaining === 0 && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                upgrade for $9/mo
              </button>
            )}
          </p>
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
              <span className="text-sm font-medium text-gray-300">README.md</span>
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
      </div>
    </>
  );
}
