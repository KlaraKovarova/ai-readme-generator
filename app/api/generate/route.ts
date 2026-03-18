import { NextRequest, NextResponse } from "next/server";
import { fetchRepoContext } from "@/lib/github";
import { generateReadme } from "@/lib/claude";
import { DEMO_README } from "@/lib/demo";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { repoUrl?: string };
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    // Graceful fallback: if API key is not configured, return the demo README
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ readme: DEMO_README, demo: true });
    }

    const context = await fetchRepoContext(repoUrl);
    const readme = await generateReadme(context);

    return NextResponse.json({ readme });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
