import * as Tone from 'tone';
import { Scale } from 'tonal';
import { PatternName } from 'tone/build/esm/event/PatternGenerator';
import { mapNote } from './toneUtils';

const scale = Scale.notes('C3 pentatonic');

const patternConfig = [
  [[0, 1, 2, 3, 4], 'down', '16n', '8n', 20],
  [[5, 6, 7], 'up', '8n', '8n', 20],
];

export class SequenceCreator {
  private sequence: number[];
  private patterns: any[];

  constructor(data?: any) {
    // compose sequence from data
    // this.sequence = composeSequence(data)
    this.sequence = [-5, -4, -5, -3, -5, -2, -4, -1, 0, 1, 2, 3, 4];
    this.patterns = [];

    this.startSequence();
  }

  public startSequence() {
    if (!this.patterns.length) {
      this.patterns = [
        new SequencePattern(this.sequence, 1, 'down', '16n', '8n', 20),
        new SequencePattern(this.sequence, 2, 'up', '8n', '8n', 20)
      ];
    } else {
      this.update();
    }
  }

  public update() {
    // update patterns
    this.patterns.forEach((p, ind) => {
      p.destroy();
      p.build(...patternConfig[ind]);
    });
  }
}


export class SequencePattern {
  private static id: number;
  private sequence!: number[];
  private noteDuration!: string;
  private tempo: string | undefined;
  private patternType!: string;
  private synth: any;
  private pattern: any;
  private reverb: any;
  private reverbDecay: number | undefined;

  constructor(
    sequence: number[],
    id: number,
    patternType: string,
    noteDuration: string,
    tempo: string,
    reverbDecay: number,
  ) {

    if (id === SequencePattern.id) {
      console.log('allready exists');
      return this;
    }
  
    this.sequence = sequence;
    this.noteDuration = noteDuration;
    this.patternType = patternType;
    this.reverbDecay = reverbDecay;
    this.tempo = tempo;
    SequencePattern.id = id;

    this.build(this.sequence, this.patternType, this.noteDuration, this.tempo, this.reverbDecay);
  }

  public build(
    sequence: number[],
    patternType: string,
    noteDuration: string,
    tempo: string,
    reverbDecay: number,
  ) {
    this.reverb = new Tone.Reverb({ decay: reverbDecay });

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
        const note = mapNote(sequence[index], scale);
        this.synth.triggerAttackRelease(note, noteDuration, time);
      },
      Array.from(this.sequence.keys()),
      (patternType || this.patternType) as PatternName
    );

    this.reverb.toDestination();
    this.synth.toDestination();
    this.pattern.interval = tempo;
    this.pattern.start();
  }

  public destroy() {
    this.pattern.stop();
    this.synth = null;
    this.pattern = null;
    this.reverb = null;
  }
}
