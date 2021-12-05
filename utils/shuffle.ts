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