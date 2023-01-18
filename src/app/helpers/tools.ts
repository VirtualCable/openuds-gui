/* eslint-disable @typescript-eslint/naming-convention */
import { timeout } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';

export const strCut = (str: string, maxLen: number): string => {
  let first: number;
  let mid: number;
  let remain: number;
  if (maxLen < 3) {
    maxLen = 3;
  }
  const sl = str.length;
  if (str.length > maxLen) {
    mid = Math.floor(maxLen / 2);
    first = mid - 1;
    remain = maxLen - mid - 2;
    return (str = str.substring(0, first) + '...' + str.substring(sl - remain));
  }
  return str;
};

export const capitalize = (str: string): string => {
  str = str.toLowerCase();
  return str.substring(0, 1).toUpperCase() + str.substr(1);
};

export const randomString = (): string => Math.random().toString().split('.')[1];

export const cleanWhiteSpaces = (str: string): string => str.split(' ').join('');

export const initialsOf = (arr: string[]): string[] => {
  const res: string[] = [];
  arr.forEach((element: string) => {
    res.push(element.substring(0, 3));
  });
  return res;
};

export const isValueEmpty = (value: any) => !!value === false;

export const isValueTrue = (value: any) => value === 'yes' || value === true || value === 'true' || value === 'True' || value === 1;

export const toPromise = <T>(awaitable: Observable<T> | Promise<T> | Future<T>, wait?: number): Promise<T> => {
  let promise: Promise<T>;
  if (awaitable instanceof Promise) {
    promise = awaitable;
  } else if (awaitable instanceof Future) {
    promise = awaitable;
  } else {
    if (wait) {
      return firstValueFrom(awaitable.pipe(timeout(wait)));
    }
    promise = firstValueFrom(awaitable);
  }
  return promise;
};

export class Future<T> implements Promise<T> {
  [Symbol.toStringTag] = 'Future';

  private promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  // overwrited on constructor
  resolve: (value: T | PromiseLike<T>) => void = () => {};
  reject: (reason?: any) => void = () => {};

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }

}
