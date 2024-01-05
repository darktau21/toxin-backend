import { randomInt } from 'crypto';

export function asyncRandomInt(max: number): Promise<number>;
export function asyncRandomInt(min: number, max: number): Promise<number>;
export function asyncRandomInt(min: number, max?: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const cb = (err: Error | null, value: number): void => {
      if (err) {
        reject(err);
      }

      resolve(value);
    };

    if (max) {
      return randomInt(min, max, cb);
    }

    return randomInt(min, cb);
  });
}
