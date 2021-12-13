import * as Tone from 'tone';
import { Scale } from 'tonal';
import { PatternName } from 'tone/build/esm/event/PatternGenerator';
import { composeConfig, mapNote, rotate } from './toneUtils';

const scale = Scale.notes('C3 pentatonic');

interface ISequenceConfig {
  id: string;
  noteDuration: string;
  patternType: string;
  reverbDecay: number;
  sequence: number[];
  tempo: string;
}

export class SequenceCreator {
  private config: ISequenceConfig;
  private pattern: any;

  constructor(data?: any) {
    // mapping todos
    // + 1. sequence depends on changePct and share in portfolio
    // + 2. patternType depends on total portfolio up or down
    // 3. tempo depends on change on next reload, the bigger the faster

    this.pattern = null;
    this.config = {
      ...composeConfig(data),
      id: `id-${new Date().getTime()}`,
    };

    this.startSequence();
  }

  public startSequence() {
    if (!this.pattern) {
      this.pattern = new SequencePattern(this.config);
    }
  }

  public update() {
    // update patterns
    this.pattern.destroy();
    this.pattern.build(this.config);
  }
}


export class SequencePattern {
  private static id: string;
  private synth: any;
  private pattern: any;
  private reverb: any;
  private eq: any;

  constructor(config: ISequenceConfig) {
    if (config.id === SequencePattern.id) {
      console.log('pattern allready exists');
      return this;
    }
  
    SequencePattern.id = config.id;

    this.build(config);
  }

  public build(config: ISequenceConfig) {
    const { noteDuration, patternType, reverbDecay, sequence, tempo } = config;
    let timesRotated = 0;
    let preparedSequence = sequence;

    this.eq = new Tone.EQ3({ low: -5, mid: -5, high: 5 });
    this.reverb = new Tone.Reverb({ decay: reverbDecay, preDelay: 0.15 });
    this.synth = new Tone.AMSynth({
      envelope: {
        attack: 0.5,
        attackCurve: 'sine',
        decay: 0.5,
        decayCurve: 'exponential',
        sustain: 0.4,
        release: 0.25,
        releaseCurve: 'sine',
      },
      modulation: {
        type: 'sine',
      },
      oscillator: {
        modulationType: 'sine',
        type: 'amsine1',
      },
    }).chain(this.reverb, this.eq);
  
    this.pattern = new Tone.Pattern(
      (time, index) => {
        if (index === sequence.length - 1) {
          preparedSequence = rotate(sequence, timesRotated++);
        }

        const note = mapNote(preparedSequence[index] || sequence[index], scale);
        this.synth.triggerAttackRelease(note, noteDuration, time);
      },
      Array.from(sequence.keys()),
      patternType as PatternName
    );

    this.synth.toDestination();
    this.eq.toDestination();
    this.reverb.toDestination();
    this.pattern.interval = tempo;
    this.pattern.start();
  }

  public destroy() {
    this.pattern.stop();
    this.eq = null;
    this.synth = null;
    this.pattern = null;
    this.reverb = null;
  }
}
