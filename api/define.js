const rateLimit = new Map();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    rateLimit.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Slow down — try again in a bit.' });
  }

  const { word } = req.body || {};

  if (!word || typeof word !== 'string' || word.trim().length === 0 || word.length > 50) {
    return res.status(400).json({ error: 'Invalid word' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Define "${word.trim()}" in 1-2 concise sentences. Just the definition, no preamble. If not a real word, say "Not a recognized word."`
        }]
      })
    });

    const data = await response.json();
    const definition = data.content?.[0]?.text || 'Could not fetch definition.';

    return res.status(200).json({ definition });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch definition' });
  }
}
