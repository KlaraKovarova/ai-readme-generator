# ReadmeGen – AI-Powered README Generator

Paste any GitHub repo URL and get a professional, ready-to-ship `README.md` in seconds. Powered by Claude AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KlaraKovarova/ai-readme-generator)

## Features

- **Instant README generation** – analyses repo structure, code, and config files automatically
- **3 free generations** – no account required to try
- **Bring Your Own Key (BYOK)** – use your own Anthropic API key for unlimited generations
- **Edit & download** – tweak the output before saving as `README.md`
- **Markdown preview** – live preview of the generated README

## Demo

> Try it live: deploy your own instance in one click with the button above.

Paste a GitHub URL like `https://github.com/vercel/next.js` and the tool will:
1. Fetch the repo's file tree, package.json, and key source files
2. Send the context to Claude AI
3. Return a professional README with badges, installation steps, usage examples, and more

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key (optional – 3 free uses included via shared key)

### Local Development

```bash
git clone https://github.com/KlaraKovarova/ai-readme-generator
cd ai-readme-generator
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

1. Fork this repo
2. Import it into [Vercel](https://vercel.com)
3. Set `ANTHROPIC_API_KEY` in environment variables (optional – enables server-side key)
4. Deploy

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Server-side Anthropic key. Users can also provide their own. |

## Tech Stack

- [Next.js 15](https://nextjs.org) – React framework
- [Anthropic Claude](https://anthropic.com) – AI backbone
- [Tailwind CSS](https://tailwindcss.com) – Styling

## Pricing Model

| Tier | Generations | Cost |
|------|-------------|------|
| Free | 3 per session | $0 |
| Pro (BYOK) | Unlimited | Your API costs only |
| Hosted Pro | Unlimited | $9/mo |

## Contributing

PRs welcome. Open an issue first for major changes.

## License

MIT – see [LICENSE](LICENSE)

---

Built by [AI Works](https://github.com/KlaraKovarova/ai-services-website) · AI-powered tools for developers
