import * as Tone from 'tone';
import { Scale } from 'tonal';
import { PatternName } from 'tone/build/esm/event/PatternGenerator';
import { mapNote, rotate } from './toneUtils';

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
  private patterns: any[];

  constructor(data?: any) {
    // compose config from data
    // this.sequence = composeConfig(data)
    this.config = {
      id: `id-${new Date().getTime()}`,
      noteDuration: '16n',
      patternType: 'up',
      reverbDecay: 20,
      sequence: [0, 1, 2, 3, 4],
      tempo: '4n',
    };
    this.patterns = [];

    this.startSequence();
  }

  public startSequence() {
    if (!this.patterns.length) {
      this.patterns = [
        new SequencePattern(this.config),
      ];
    }
  }

  public update() {
    // update patterns
    this.patterns.forEach((p) => {
      p.destroy();
      p.build(this.config);
    });
  }
}


export class SequencePattern {
  private static id: string;
  private synth: any;
  private pattern: any;
  private reverb: any;

  constructor(config: ISequenceConfig) {
    if (config.id === SequencePattern.id) {
      console.log('allready exists');
      return this;
    }
  
    SequencePattern.id = config.id;

    this.build(config);
  }

  public build(config: ISequenceConfig) {
    const { noteDuration, patternType, reverbDecay, sequence, tempo } = config;

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

    let timesRotated = 0;
    let preparedSequence = sequence;
  
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
