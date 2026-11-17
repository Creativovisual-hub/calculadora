"""Sellos sonoros de bienvenida (instrumentos andinos sintetizados).
Uso: python3 herramientas/sonidos/generar.py  -> sonidos/bienvenida-*.mp3 (requiere numpy y ffmpeg)"""
import numpy as np, wave, os, subprocess
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'sonidos')
rng = np.random.default_rng(3)
C5, D5, E5, G5, A5, C6, D6, E6, G6 = 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98

def ks(f, dur, decay=0.994):          # cuerda pulsada (Karplus-Strong)
    n = int(SR*dur); p = int(SR/f); buf = rng.uniform(-1, 1, p); y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]; buf[i % p] = decay*0.5*(buf[i % p]+buf[(i+1) % p])
    return y
def charango(f, dur=0.5): return ks(f, dur) + 0.8*ks(f*1.004, dur)   # cuerdas dobles
def bandnoise(n, fc, bw):
    X = np.fft.rfft(rng.standard_normal(n)); fr = np.fft.rfftfreq(n, 1/SR); X *= np.exp(-((fr-fc)/bw)**2)
    y = np.fft.irfft(X, n); return y/np.max(np.abs(y))
def zampona(f, dur):                  # flauta de pan: tono hueco + soplo
    n = int(SR*dur); t = np.arange(n)/SR
    vib = 1+0.007*np.sin(2*np.pi*6*t)*np.clip((t-0.12)/0.15, 0, 1)
    ph = 2*np.pi*f*np.cumsum(vib)/SR
    tone = np.sin(ph)+0.2*np.sin(2*ph)+0.06*np.sin(3*ph)
    env = np.clip(t/0.02, 0, 1)*np.clip((dur-t)/min(0.12, dur*0.4), 0, 1)
    return env*(tone+0.2*bandnoise(n, f, f*0.3))+0.3*bandnoise(n, f*2, f)*np.exp(-t*50)
def bombo(dur=0.4):
    n = int(SR*dur); t = np.arange(n)/SR; f = 60+50*np.exp(-t*25)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10)
def sonajero(dur=0.06):
    n = int(SR*dur); t = np.arange(n)/SR; return bandnoise(n, 7000, 2500)*np.exp(-t*60)
def pop(f, dur=0.18):                 # burbuja: pulso con caída de tono
    n = int(SR*dur); t = np.arange(n)/SR; ff = f*(1+0.6*np.exp(-t*60))
    return np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-t*22)

class Mix:
    def __init__(s, dur): s.x = np.zeros(int(SR*dur))
    def add(s, sig, t, amp=1.0):
        i = int(t*SR); n = min(len(sig), len(s.x)-i); s.x[i:i+n] += amp*sig[:n]
    def save(s, name):
        x = s.x/np.max(np.abs(s.x))*0.88; k = int(SR*0.12); x[-k:] *= np.linspace(1, 0, k)
        wav = os.path.join(OUT, name+'.wav')
        w = wave.open(wav, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-b:a', '128k', os.path.join(OUT, name+'.mp3')], check=True)
        os.remove(wav)

def rasgueo(m, t, notas, amp=0.15, dur=0.6):
    for k, f in enumerate(notas): m.add(charango(f, dur), t+k*0.014, amp)

# A · Regalo: "ta-ta-AN-des"
m = Mix(0.95)
for f, t, d in [(G5, 0, .08), (C6, .09, .08), (E6, .20, .14), (C6, .36, .5)]:
    m.add(zampona(f, d), t, .5); m.add(charango(f, .4), t, .12)
m.add(bombo(), .36, .4); rasgueo(m, .36, [C5, E5, G5, C6])
m.save('bienvenida-a-regalo')

# B · Fiesta andina: rasgueo de huayno "ta-ka-ta-TAN" + sonajero + "AN-des"
m = Mix(1.25)
for t, a in [(0, .14), (.10, .09), (.16, .12), (.27, .16)]:
    rasgueo(m, t, [C5, E5, G5, C6], a, .35); m.add(sonajero(), t, .1)
m.add(bombo(), 0, .35); m.add(bombo(), .27, .3)
m.add(zampona(E6, .16), .42, .5); m.add(zampona(C6, .6), .60, .5)
m.add(bombo(), .60, .45); rasgueo(m, .60, [C5, E5, G5, C6], .17, .6)
m.save('bienvenida-b-fiesta-andina')

# C · Beneficios al vuelo: 6 burbujas que suben (una por beneficio) + "AN-des"
m = Mix(1.35)
for i, f in enumerate([C5, D5, E5, G5, A5, C6]):
    m.add(pop(f*1.5), .0+i*.09, .45); m.add(charango(f*2, .25), .0+i*.09, .05)
m.add(zampona(E6, .16), .62, .5); m.add(zampona(C6, .6), .80, .5)
m.add(bombo(), .80, .4); rasgueo(m, .80, [C5, E5, G5, C6], .14, .5)
m.save('bienvenida-c-beneficios')
print('ok')

# ---------- Tonos de interfaz (estilo apps de movilidad: cortos, limpios, sutiles)
def marimba(f, dur=0.35):
    n = int(SR*dur); t = np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*4*f*t)*np.exp(-t*40))*np.exp(-t*9)*np.clip(t/0.003, 0, 1)
def cristal(f, dur=0.5):            # FM suave tipo campana de vidrio
    n = int(SR*dur); t = np.arange(n)/SR
    mod = 1.2*np.exp(-t*12)*np.sin(2*np.pi*f*3.5*t)
    return np.sin(2*np.pi*f*t+mod)*np.exp(-t*6)*np.clip(t/0.004, 0, 1)
def soplo(f, dur=0.35):             # tono redondo con un poco de aire (guiño a la zampoña)
    n = int(SR*dur); t = np.arange(n)/SR
    env = np.clip(t/0.03, 0, 1)*np.exp(-t*5)
    return env*(np.sin(2*np.pi*f*t)+0.12*np.sin(4*np.pi*f*t)+0.08*bandnoise(n, f, f*0.25))

m = Mix(0.55); m.add(marimba(C6), 0, .6); m.add(marimba(G6), .11, .7)
m.save('tono-1-pulso')            # dos notas que suben: "listo"
m = Mix(0.7); [m.add(cristal(f), t, a) for f, t, a in [(E6, 0, .5), (G6, .07, .5), (C6*2, .14, .6)]]
m.save('tono-2-brillo')           # tres destellos rápidos: "algo bueno pasó"
m = Mix(0.6); m.add(soplo(E6, .3), 0, .6); m.add(soplo(C6, .5), .13, .7)
m.save('tono-3-andes')            # "AN-des" en dos notas, suave
print('tonos ok')
