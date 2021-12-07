import { Interval, transpose } from 'tonal';

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

// TODO % instead of hardcoded timesRotated
export function rotate(arr: number[], offset: number) {
  const n = offset % arr.length;

  return [
    ...arr.slice(n, arr.length),
    ...arr.slice(0, n),
  ];
}
