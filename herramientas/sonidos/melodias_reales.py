"""Melodías con instrumentos muestreados reales (FluidR3_GM, licencia MIT).
Requiere: apt install fluidsynth fluid-soundfont-gm ; pip install mido ; ffmpeg
Uso: python3 herramientas/sonidos/melodias_reales.py -> sonidos/melodia-real-*.mp3"""
import mido, os, random, subprocess, tempfile
SF = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'sonidos')
BPM = 100; TPB = 480; S16 = TPB//4
random.seed(11)
n = lambda s: {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}[s[0]] + (1 if '#' in s else 0) + 12*(int(s[-1])+1)

def render(nombre, pistas):
    """pistas: lista de (programa, canal, [(nota, inicio_16avos, dur_16avos, velocidad)])"""
    mid = mido.MidiFile(ticks_per_beat=TPB)
    meta = mido.MidiTrack(); meta.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM))); mid.tracks.append(meta)
    for prog, ch, notas in pistas:
        tr = mido.MidiTrack(); mid.tracks.append(tr)
        tr.append(mido.Message('program_change', program=prog, channel=ch, time=0))
        tr.append(mido.Message('control_change', control=91, value=70, channel=ch, time=0))  # reverb
        ev = []
        for nota, ini, dur, vel in notas:
            h = random.randint(-8, 8)                      # humanizar tiempo (ms aprox)
            t0 = max(0, int(ini*S16) + h); t1 = int((ini+dur)*S16)
            v = max(1, min(127, vel + random.randint(-6, 6)))  # humanizar intensidad
            ev += [(t0, 'note_on', n(nota), v), (t1, 'note_off', n(nota), 0)]
        ev.sort(key=lambda e: (e[0], e[1] == 'note_on')); last = 0
        for t, typ, note, v in ev:
            tr.append(mido.Message(typ, note=note, velocity=v, channel=ch, time=t-last)); last = t
    with tempfile.TemporaryDirectory() as d:
        mp, wav = os.path.join(d, 'm.mid'), os.path.join(d, 'm.wav')
        mid.save(mp)
        subprocess.run(['fluidsynth', '-ni', '-g', '0.7', '-r', '44100', '-F', wav, SF, mp], check=True, capture_output=True)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-af',
                        'silenceremove=start_periods=1:start_threshold=-50dB,atrim=0:2.6,afade=t=out:st=2.1:d=0.5,loudnorm=I=-16:TP=-1.5',
                        '-ar', '44100', '-b:a', '160k', os.path.join(OUT, f'{nombre}.mp3')], check=True)

def roll(acorde, ini, dur, vel, paso=0.25):            # acorde arpegiado suave (como arpa/guitarra)
    return [(x, ini + i*paso, dur - i*paso, vel - i*4) for i, x in enumerate(acorde)]

# Motivo "Ca-ja Los AN-des" en Re mayor: La Re Fa# | SI (acento) | LA (largo)
MEL = [('A4', 0, 1, 78), ('D5', 1, 1, 82), ('F#5', 2, 1, 86), ('B5', 3, 2, 104), ('A5', 5, 9, 92)]
BAJO = [('D2', 0, 3, 60), ('G2', 3, 2, 66), ('D2', 5, 9, 70)]
CUERDAS = [('D4', 0, 3, 38), ('F#4', 0, 3, 34), ('B3', 3, 2, 40), ('D4', 3, 2, 38), ('A3', 5, 9, 42), ('F#4', 5, 9, 40), ('E4', 5, 9, 36)]

# 1 · Brillo: celesta + arpa + cuerdas suaves
render('melodia-real-1-brillo', [
    (8, 0, MEL + [('D6', 6, 6, 60)]),                                  # celesta (con eco agudo)
    (46, 1, roll(['D3', 'A3', 'F#4'], 0, 3, 60) + roll(['G2', 'D3', 'B3', 'F#4'], 3, 2, 64, .2) + roll(['D3', 'A3', 'E4', 'F#4', 'A4'], 5, 9, 70, .3)),
    (48, 2, CUERDAS), (32, 3, BAJO)])
# 2 · Andina natural: zampoña + guitarra de nylon (rasgueo) + cuerdas
render('melodia-real-2-andina', [
    (75, 0, MEL),
    (24, 1, roll(['D3', 'A3', 'D4', 'F#4'], 0, 3, 64, .12) + roll(['G2', 'D3', 'G3', 'B3', 'D4'], 3, 2, 70, .1) + roll(['D3', 'A3', 'D4', 'F#4', 'A4'], 5, 9, 74, .12)),
    (48, 2, CUERDAS), (32, 3, BAJO)])
# 3 · Cálida: marimba + vibráfono + cuerdas
render('melodia-real-3-calida', [
    (12, 0, MEL), (11, 1, [(x, i, d, v-30) for x, i, d, v in MEL]),
    (48, 2, CUERDAS), (32, 3, BAJO)])
print('ok')
