const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface TreeEntry {
  path: string;
  type: string;
  sha: string;
  url: string;
}

interface FileContent {
  path: string;
  content: string;
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/\s.]+?)(?:\.git)?(?:\/.*)?$/,
    /^([^/]+)\/([^/]+)$/,
  ];
  for (const p of patterns) {
    const m = url.trim().match(p);
    if (m) return { owner: m[1], repo: m[2] };
  }
  return null;
}

const PRIORITY_FILES = [
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "Makefile",
  "Dockerfile",
  "docker-compose.yml",
  "requirements.txt",
  "setup.py",
  "setup.cfg",
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "__pycache__",
  ".pytest_cache",
  "vendor",
]);

const MAX_FILE_BYTES = 8000;
const MAX_FILES = 20;

export async function fetchRepoContext(repoUrl: string): Promise<string> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error("Invalid GitHub URL");

  const { owner, repo } = parsed;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  // Get repo metadata
  const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!metaRes.ok) {
    const err = await metaRes.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `GitHub API error ${metaRes.status}`);
  }
  const meta = await metaRes.json() as {
    description?: string;
    language?: string;
    topics?: string[];
    stargazers_count?: number;
    default_branch?: string;
  };

  // Get file tree
  const branch = meta.default_branch ?? "main";
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );
  if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
  const tree = await treeRes.json() as { tree: TreeEntry[] };

  const files = (tree.tree ?? []).filter(
    (f) =>
      f.type === "blob" &&
      !SKIP_DIRS.has(f.path.split("/")[0]) &&
      !f.path.includes("node_modules") &&
      !f.path.includes(".min.")
  );

  // Prioritise important files, then source files, up to MAX_FILES
  const prioritised: TreeEntry[] = [];
  const rest: TreeEntry[] = [];
  for (const f of files) {
    const name = f.path.split("/").pop() ?? "";
    if (PRIORITY_FILES.includes(name)) prioritised.push(f);
    else rest.push(f);
  }
  const toFetch = [...prioritised, ...rest].slice(0, MAX_FILES);

  const fetchedFiles: FileContent[] = [];
  await Promise.allSettled(
    toFetch.map(async (f) => {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${f.path}?ref=${branch}`,
        { headers }
      );
      if (!r.ok) return;
      const data = await r.json() as { content?: string; encoding?: string };
      if (!data.content) return;
      const raw = Buffer.from(data.content, "base64").toString("utf-8");
      fetchedFiles.push({ path: f.path, content: raw.slice(0, MAX_FILE_BYTES) });
    })
  );

  const fileTree = files
    .slice(0, 100)
    .map((f) => f.path)
    .join("\n");

  const context = [
    `Repository: ${owner}/${repo}`,
    `Description: ${meta.description ?? "none"}`,
    `Primary language: ${meta.language ?? "unknown"}`,
    `Topics: ${(meta.topics ?? []).join(", ") || "none"}`,
    `Stars: ${meta.stargazers_count ?? 0}`,
    "",
    "File tree (up to 100 entries):",
    fileTree,
    "",
    "Key file contents:",
    ...fetchedFiles.map((f) => `\n--- ${f.path} ---\n${f.content}`),
  ].join("\n");

  return context;
}
