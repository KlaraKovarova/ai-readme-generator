import Anthropic from "@anthropic-ai/sdk";

function getClient(apiKey?: string) {
  return new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
}

const SYSTEM_PROMPT = `You are an expert technical writer. Given information about a code repository, generate a professional, well-structured README.md.

The README must:
1. Start with a concise, compelling project title and one-line description
2. Include relevant badges (build, license, etc.) as placeholders where appropriate
3. Contain these sections as applicable: Features, Prerequisites, Installation, Usage, API (if applicable), Configuration, Contributing, License
4. Use clear, professional English
5. Include realistic code examples based on what you find in the codebase
6. Be opinionated and complete — don't hedge with "if applicable" in the body text

Output ONLY the raw markdown content, no preamble.`;

export async function generateReadme(repoContext: string, apiKey?: string): Promise<string> {
  const message = await getClient(apiKey).messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the repository context:\n\n${repoContext}\n\nGenerate a complete README.md for this project.`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response from Claude");
  return block.text;
}
