const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SCHEMA_SELECCION = {
  type: Type.OBJECT,
  properties: {
    resumen: { type: Type.STRING },
    seleccion: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          razon: { type: Type.STRING }
        },
        required: ['id', 'razon']
      }
    }
  },
  required: ['resumen', 'seleccion']
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, texto } = req.body || {};
  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ error: 'Falta el campo "texto".' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el proyecto de Vercel.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: texto,
      config: {
        systemInstruction: system || '',
        responseMimeType: 'application/json',
        responseJsonSchema: SCHEMA_SELECCION
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (err) {
    const status = err.status || err.code || 502;
    return res.status(typeof status === 'number' && status >= 400 && status < 600 ? status : 502).json({
      error: err.message || 'Error al contactar a la API de Gemini.'
    });
  }
};
