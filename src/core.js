import {multiarity, curry} from './core/function.js';
import * as cons from './core/cons.js';
import * as transduce from './core/transduce.js';

export const map = multiarity(transduce.map, cons.map);
export const filter = multiarity(transduce.filter, cons.filter);
export const remove = multiarity(transduce.remove, cons.remove);
export const take = multiarity(transduce.take, cons.take);
export const takeWhile = multiarity(transduce.takeWhile, cons.takeWhile);
export const takeNth = multiarity(transduce.takeNth, cons.takeNth);
export const drop = multiarity(transduce.drop, cons.drop);
export const dropWhile = multiarity(transduce.dropWhile, cons.dropWhile);
export const property = curry(function(key, obj){
  return obj[key];
});
