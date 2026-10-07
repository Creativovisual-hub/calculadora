const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Lectura de la foto de una boleta para la calculadora de /cuentas
const SCHEMA_BOLETA = {
  type: Type.OBJECT,
  properties: {
    local: { type: Type.STRING, nullable: true },
    fecha: { type: Type.STRING, nullable: true, description: 'Fecha de la boleta en formato YYYY-MM-DD' },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nombre: { type: Type.STRING },
          cantidad: { type: Type.NUMBER },
          precio_unitario: { type: Type.NUMBER },
          total: { type: Type.NUMBER }
        },
        required: ['nombre', 'cantidad', 'precio_unitario', 'total']
      }
    },
    subtotal: { type: Type.NUMBER, nullable: true },
    descuento: { type: Type.NUMBER, nullable: true },
    propina: { type: Type.NUMBER, nullable: true },
    total: { type: Type.NUMBER, nullable: true },
    legible: { type: Type.BOOLEAN }
  },
  required: ['items', 'legible']
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

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imagen, mimeType } = req.body || {};
  if (!imagen || typeof imagen !== 'string') {
    return res.status(400).json({ error: 'Falta la imagen de la boleta.' });
  }
  const tipo = TIPOS.includes(mimeType) ? mimeType : 'image/jpeg';
  const datos = imagen.replace(/^data:[^,]+,/, '');

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el proyecto de Vercel.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: tipo, data: datos } },
          { text: 'Extrae los productos de esta boleta.' }
        ]
      }],
      config: {
        systemInstruction: INSTRUCCIONES,
        responseMimeType: 'application/json',
        responseSchema: SCHEMA_BOLETA,
        temperature: 0
      }
    });

    return res.status(200).json(JSON.parse(response.text));
  } catch (err) {
    const status = err.status || err.code || 502;
    return res.status(typeof status === 'number' && status >= 400 && status < 600 ? status : 502).json({
      error: err.message || 'Error al contactar a la API de Gemini.'
    });
  }
};
