export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { word } = req.body;

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
