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

export function trimMultipleOfFive(arr: number[]) {
  return arr.slice(0, arr.length - arr.length % 5);
}

export function composeConfig(data: IStockData[]) {
  // getting patternTypes and sequence
  // + 1. check if in total all goes up or down
  // + 2. sort. if down - descending, if up - ascending
  // + 3. map and generate steps depending on share - bigger share - more notes
  // + 4. remove duplicates following notes
  // + 5. make % 5 if not
  const isTotalUp = Boolean(data.reduce((acc, item) => acc + item.changePct, 0) > 0);
  const steps = generateSteps(data, isTotalUp)
    .sort(isTotalUp ? sortByChangePctAscending : sortByChangePctDescending)
    .reduce((acc: number[], item) => [...acc, ...item.steps], [])
    .filter((item, ind, arr) => item !== arr[ind + 1]); // filter following duplicates


  return {
    // 1 : 4 [{ noteDuration: 32, tempo: 8 }, { noteDuration: 16, tempo: 4n }]
    noteDuration: '32n',
    patternType: 'alternateUp',
    reverbDecay: 20,
    sequence: trimMultipleOfFive(steps),
    tempo: '8n',
  };
}
