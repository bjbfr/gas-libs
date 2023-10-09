///<reference path="./utils.ts">

namespace Utils {
  export function unique<T>(xs: Array<T>) {
    return xs.reduce(
      (acc: Array<T>, x: T) => {
        if (acc.findIndex(y => y === x) === -1)
          acc.push(x)
        return acc;
      }, []
    );
  }
  export function unique_wkey<T extends Obj_t>(xs: Array<T>, k: Key_t) {
    return xs.reduce(
      (acc: Array<T>, x: T) => {
        if (acc.findIndex((y: T) => y[k] === x[k]) === -1)
          acc.push(x)
        return acc;
      }, []
    );
  }
  export function zip<T>(xs: Array<T>, ys: Array<T>) {
    if (xs.length <= ys.length)
      return xs.map((x: T, i: number) => [x, ys[i]]);
    else
      return ys.map((y, i) => [xs[i], y]);
  }
}