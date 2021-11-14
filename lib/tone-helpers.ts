import * as Tone from 'tone';
import { Interval, Scale, transpose } from 'tonal';
import { PatternName } from 'tone/build/esm/event/PatternGenerator';

const sequence = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
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
  private static instance: SequencePattern;
  private transposeNote!: number;
  private noteDuration!: string;
  private tempo!: string;
  private patternType!: string;
  private synth: any;
  private pattern: any;

  constructor(
    patternType = 'up',
    transposeNote = 0,
    noteDuration = '8n',
    tempo = '1n',
  ) {

    if (SequencePattern.instance) {
      return SequencePattern.instance;
    }
  
    SequencePattern.instance = this;

    this.transposeNote = transposeNote;
    this.noteDuration = noteDuration;
    this.patternType = patternType;
    this.tempo = tempo;

    this.build();
  }

  public build(
    patternType?: string,
    transposeNote?: number,
    noteDuration?: string,
    tempo?: string,
  ) {
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'sine',
      }
    });

    this.pattern = new Tone.Pattern(
      (time, index) => {
        const note = mapNote(sequence[index] + (transposeNote || this.transposeNote), scale);
        this.synth.triggerAttackRelease(note, noteDuration || this.noteDuration, time);
        console.log(note);
      },
      Array.from(sequence.keys()),
      (patternType || this.patternType) as PatternName
    );

    this.synth.toDestination();
    this.pattern.interval = tempo || this.tempo;
    this.pattern.start();
  }

  public destroy() {
    this.pattern.stop();
    this.synth = null;
    this.pattern = null;
  }
}
