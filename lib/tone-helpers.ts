import * as Tone from 'tone';
import { Interval, Scale, transpose } from 'tonal';
import { PatternName } from 'tone/build/esm/event/PatternGenerator';

const sequence = [-5, -4, -5, -3, -5, -2, -4, -1, 0, 1, 2, 3, 4];
const scale = Scale.notes('C3 pentatonic');

function mapNote(noteNumber: number, scale: string[]) {
  const i = modulo(noteNumber, scale.length);
  const note = scale[i];
  const octaveTranspose = Math.floor(noteNumber / scale.length);
  const interval = Interval.fromSemitones(octaveTranspose * 12);  

  return transpose(note, interval);
}

// modulo to get only positive values
function modulo(n: number, length: number) {
  return ((n % length) + length) % length;
}

export class SequencePattern {
  private static id: number;
  private transposeNote!: number;
  private noteDuration!: string;
  private tempo: string | undefined;
  private patternType!: string;
  private synth: any;
  private pattern: any;
  private reverb: any;
  private reverbDecay: number | undefined;

  constructor(
    id = 1,
    patternType = 'down',
    transposeNote = 0,
    noteDuration = '16n',
    tempo = '8n',
    reverbDecay = 20,
  ) {

    if (id === SequencePattern.id) {
      console.log('allready exists');
      return this;
    }
  
    this.transposeNote = transposeNote;
    this.noteDuration = noteDuration;
    this.patternType = patternType;
    this.reverbDecay = reverbDecay;
    this.tempo = tempo;
    SequencePattern.id = id;

    this.build();
  }

  public build(
    patternType?: string,
    transposeNote?: number,
    noteDuration?: string,
    tempo?: string,
    reverbDecay?: number,
  ) {
    this.reverb = new Tone.Reverb({ decay: reverbDecay || this.reverbDecay });

    this.synth = new Tone.AMSynth({
      envelope: {
        attack: 0.75,
        attackCurve: 'sine',
        decay: 0.5,
        decayCurve: 'exponential',
        sustain: 0.75,
        release: 0.75,
        releaseCurve: 'cosine',
      },
      modulation: {
        type: 'sine',
      },
      oscillator: {
        modulationType: 'sine',
        type: 'amsine1',
      },
    }).connect(this.reverb);

    this.pattern = new Tone.Pattern(
      (time, index) => {
        const note = mapNote(sequence[index] + (transposeNote || this.transposeNote), scale);
        this.synth.triggerAttackRelease(note, noteDuration || this.noteDuration, time);
      },
      Array.from(sequence.keys()),
      (patternType || this.patternType) as PatternName
    );

    this.reverb.toDestination();
    this.synth.toDestination();
    this.pattern.interval = tempo || this.tempo;
    this.pattern.start();
  }

  public destroy() {
    this.pattern.stop();
    this.synth = null;
    this.pattern = null;
    this.reverb = null;
  }
}
