const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, texto } = req.body || {};
  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ error: 'Falta el campo "texto".' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en el proyecto de Vercel.' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4096,
      output_config: { effort: 'low' },
      system: system || '',
      messages: [{ role: 'user', content: texto }]
    });
    return res.status(200).json(response);
  } catch (err) {
    const status = err.status || 502;
    return res.status(status).json({ error: err.message || 'Error al contactar a la API de Anthropic.' });
  }
};
