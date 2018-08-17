import IHash from "./instance";
export const hash = IHash.hash;
import {overload} from "../../core";

function memoize1(f){
  return memoize2(f, function(...args){
    return hash(args);
  });
}

function memoize2(f, hash){
  const cache = {};
  return function(...args){
    const key = hash(...args);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    } else {
      const result = f(...args);
      cache[key] = result;
      return result;
    }
  }
}
export const memoize = overload(null, memoize1, memoize2);
