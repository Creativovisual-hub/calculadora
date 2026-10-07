// Lectura de la foto de una boleta para la calculadora de /cuentas, con Claude (API de Anthropic)
const { Anthropic } = require('@anthropic-ai/sdk');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';

const numOrNull = { anyOf: [{ type: 'number' }, { type: 'null' }] };
const strOrNull = { anyOf: [{ type: 'string' }, { type: 'null' }] };
const SCHEMA_BOLETA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    local: strOrNull,
    fecha: strOrNull,
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
    subtotal: numOrNull,
    descuento: numOrNull,
    propina: numOrNull,
    total: numOrNull,
    legible: { type: 'boolean' }
  },
  required: ['local', 'fecha', 'items', 'subtotal', 'descuento', 'propina', 'total', 'legible']
};

const INSTRUCCIONES = `Eres un lector de boletas y precuentas de restaurantes chilenos.
Extrae los productos consumidos de la imagen.
- Los montos están en pesos chilenos (CLP), sin decimales: "1.990" o "$1.990" significa 1990.
- Por cada línea de producto entrega nombre (como aparece, con mayúscula inicial), cantidad, precio_unitario y total de la línea (cantidad × precio_unitario).
- En muchas precuentas el monto impreso a la derecha es el TOTAL de la línea (ej: "2 Arepa de Perico 7.980" = 2 × 3.990). Calcula precio_unitario = total / cantidad.
- Mantén cada línea por separado aunque el producto se repita (pueden ser de personas distintas). Si el nombre viene cortado, déjalo tal cual.
- NO incluyas como producto: subtotal, total, propina / propina sugerida / servicio, descuentos, IVA, neto, medios de pago, vuelto ni números de mesa o garzón.
- Los modificadores con precio (ej: "+ extra pollo $1.900") van como su propia línea.
- subtotal = suma de los productos ANTES de propina (si aparecen varios "Subtotal", usa el que va antes de la propina). descuento (positivo), propina y total: solo si aparecen impresos; si no, null.
- local: nombre del restaurante si aparece. fecha: si aparece, en formato YYYY-MM-DD (las boletas usan DD/MM/AA).
- legible = false si la imagen no es una boleta o no se puede leer; en ese caso items vacío.`;

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

module.exports = async function handler(req, res) {
  // Diagnóstico: abrir /api/receipt en el navegador muestra si la clave está configurada (sin revelarla)
  if (req.method === 'GET') {
    const key = (process.env.ANTHROPIC_API_KEY || '').trim();
    return res.status(200).json({
      servicio: 'Lectura de boletas con Claude',
      clave_configurada: Boolean(key),
      formato_clave_ok: /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key),
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
  const datos = imagen.replace(/^data:[^,]+,/, '');

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en el proyecto de Vercel.' });
  }

  const client = new Anthropic({ apiKey });
  try {
    // fallbacks "default": si el modelo rechazara la solicitud, la API la reintenta con otro modelo
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: INSTRUCCIONES,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA_BOLETA } },
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: tipo, data: datos } },
          { type: 'text', text: 'Extrae los productos de esta boleta.' }
        ]
      }]
    });

    if (response.stop_reason === 'refusal') {
      return res.status(502).json({ error: 'Claude no pudo procesar esta imagen.' });
    }
    if (response.stop_reason === 'max_tokens') {
      return res.status(502).json({ error: 'La boleta es demasiado larga para leerla de una vez.' });
    }
    const texto = response.content.find((b) => b.type === 'text');
    if (!texto) {
      return res.status(502).json({ error: 'Claude no devolvió la lectura de la boleta.' });
    }
    return res.status(200).json(JSON.parse(texto.text));
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(401).json({ error: 'La clave de Anthropic no es válida (revisa ANTHROPIC_API_KEY en Vercel).' });
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      return res.status(403).json({ error: 'La clave de Anthropic no tiene permiso para usar este modelo.' });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'Demasiadas solicitudes a Claude. Espera un momento y vuelve a intentar.' });
    }
    if (err instanceof Anthropic.APIError) {
      const status = typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 502;
      const msg = (err.error && err.error.error && err.error.error.message) || err.message;
      return res.status(status).json({ error: msg || 'Error al contactar a la API de Anthropic.' });
    }
    return res.status(502).json({ error: (err && err.message) || 'Error al leer la boleta.' });
  }
};
