import { Interval, transpose } from 'tonal';
import { IStockData } from '../utils/composeStockData';

export function mapNote(noteNumber: number, scale: string[]) {
  const i = modulo(noteNumber, scale.length);
  const note = scale[i];
  const octaveTranspose = Math.floor(noteNumber / scale.length);
  const interval = Interval.fromSemitones(octaveTranspose * 12);  

  return transpose(note, interval);
}

// modulo to get only positive values
export function modulo(n: number, length: number) {
  return ((n % length) + length) % length;
}

export function getUniqueAndRepeated(arr: number[]) {
  const repeated: number[] = [];
  const unique = arr.reduce((acc: number[], item: number) => {
    if (acc.indexOf(item) < 0) {
      return [...acc, item]; 
    } else {
      repeated.push(item);
      return acc;
    }
  }, []);

  return { 
    unique,
    repeated,
  };
}

export function shuffleUniqueAndRepeated(unique: number[], repeated: number[]) {
  return unique.reduce((acc: number[], item: number, ind: number) => {
    // find in repeated[] item that is not equal neither curr, nor curr + 1
    const nonEqualToClosest = repeated.find((el, i) => {
      if (el !== unique[ind] && el !== unique[ind + 1]) {
        repeated.splice(i, 1);

        return el;
      }
    });

    return nonEqualToClosest || nonEqualToClosest === 0 ? [...acc, item, nonEqualToClosest] : [...acc, item];
  }, []);
}

export function rotate(arr: number[], offset: number) {
  const n = offset % arr.length;

  return [
    ...arr.slice(n, arr.length),
    ...arr.slice(0, n),
  ];
}

export function sortByChangePctAscending(a: IStockData, b: IStockData) {
  const elA = a.changePct;
  const elB = b.changePct;

  if (elA === elB) {
    return 0;
  }

  return elA < elB ? -1 : 1;
}

export function sortByChangePctDescending(a: IStockData, b: IStockData) {
  const elA = a.changePct;
  const elB = b.changePct;

  if (elA === elB) {
    return 0;
  }

  return elA > elB ? -1 : 1;
}

export function generateSteps(data: IStockData[], isTotalUp: boolean) {
  const range = isTotalUp ? [-4, -3, -2, -1, 0, 1, 2, 3, 4] : [4, 3, 2, 1, 0, -1, -2, -3, -4];

  return [...data]
    .sort((a, b) => +a.share > +b.share ? -1 : 1)
    .map((item, index, arr) => {
      const arrLength = arr.length > range.length ? range.length : arr.length;

      return {
        ...item,
        steps: range.slice(0, arrLength - index % arrLength),
      };
    });
}

export function shuffleSteps(steps: number[]) {
  const { unique, repeated } = getUniqueAndRepeated(steps);

  return shuffleUniqueAndRepeated(unique, repeated);
}

export function composeConfig(data: IStockData[]) {
  // getting patternTypes and sequence
  // + 1. check if in total all goes up or down
  // + 2. sort. if down - descending, if up - ascending
  // + 3. map and generate steps depending on share - bigger share - more notes
  // TODO think on step 3 and shuffle function
  const isTotalUp = Boolean(data.reduce((acc, item) => acc + item.changePct, 0) > 0);
  const arrWithSteps = generateSteps(data, isTotalUp);
  const sortedByChangePct = arrWithSteps.sort(isTotalUp ? sortByChangePctAscending : sortByChangePctDescending);
  const steps = sortedByChangePct.reduce((acc: number[], item) => [...acc, ...item.steps], []);

  return {
    patternType: isTotalUp ? 'up' : 'down',
    sequence: shuffleSteps(steps),
  };
}
