// Lectura de la foto de una boleta para la calculadora de /cuentas, con ChatGPT (API de OpenAI)

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const num = { type: ['number', 'null'] };
const SCHEMA_BOLETA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    local: { type: ['string', 'null'] },
    fecha: { type: ['string', 'null'], description: 'Fecha de la boleta en formato YYYY-MM-DD' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          nombre: { type: 'string' },
          cantidad: { type: 'number' },
          precio_unitario: { type: 'number' },
          total: { type: 'number' }
        },
        required: ['nombre', 'cantidad', 'precio_unitario', 'total']
      }
    },
    subtotal: num,
    descuento: num,
    propina: num,
    total: num,
    legible: { type: 'boolean' }
  },
  required: ['local', 'fecha', 'items', 'subtotal', 'descuento', 'propina', 'total', 'legible']
};

const INSTRUCCIONES = `Eres un lector de boletas y precuentas de restaurantes chilenos.
Extrae los productos consumidos de la imagen.
- Los montos están en pesos chilenos (CLP), sin decimales: "1.990" o "$1.990" significa 1990.
- Por cada línea de producto entrega nombre (como aparece, con mayúscula inicial), cantidad, precio_unitario y total de la línea (cantidad × precio_unitario).
- Si la línea solo muestra el total y una cantidad, calcula precio_unitario = total / cantidad.
- NO incluyas como producto: subtotal, total, propina / propina sugerida / servicio, descuentos, IVA, neto, medios de pago, vuelto ni números de mesa o garzón.
- Los modificadores con precio (ej: "+ extra pollo $1.900") van como su propia línea.
- subtotal, descuento (positivo), propina y total: solo si aparecen impresos; si no, null.
- local: nombre del restaurante si aparece. fecha: si aparece, en formato YYYY-MM-DD.
- legible = false si la imagen no es una boleta o no se puede leer; en ese caso items vacío.`;

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

module.exports = async function handler(req, res) {
  // Diagnóstico: abrir /api/receipt en el navegador muestra si la clave está configurada (sin revelarla)
  if (req.method === 'GET') {
    const key = (process.env.OPENAI_API_KEY || '').trim();
    return res.status(200).json({
      servicio: 'Lectura de boletas con ChatGPT',
      clave_configurada: Boolean(key),
      formato_clave_ok: /^sk-[A-Za-z0-9_-]{20,}$/.test(key),
      modelo: MODEL
    });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imagen, mimeType } = req.body || {};
  if (!imagen || typeof imagen !== 'string') {
    return res.status(400).json({ error: 'Falta la imagen de la boleta.' });
  }
  const tipo = TIPOS.includes(mimeType) ? mimeType : 'image/jpeg';
  const dataUrl = imagen.startsWith('data:') ? imagen : `data:${tipo};base64,${imagen}`;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY no está configurada en el proyecto de Vercel.' });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        messages: [
          { role: 'system', content: INSTRUCCIONES },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrae los productos de esta boleta.' },
              { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } }
            ]
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'boleta', strict: true, schema: SCHEMA_BOLETA }
        }
      })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = (data.error && data.error.message) || `Error ${r.status} de la API de OpenAI.`;
      return res.status(r.status >= 400 && r.status < 600 ? r.status : 502).json({ error: msg });
    }

    const choice = data.choices && data.choices[0];
    if (!choice || choice.message.refusal || !choice.message.content) {
      return res.status(502).json({ error: 'ChatGPT no pudo leer la boleta.' });
    }
    return res.status(200).json(JSON.parse(choice.message.content));
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Error al contactar a la API de OpenAI.' });
  }
};
