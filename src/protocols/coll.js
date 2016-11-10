import protocol from '../protocol';
import {flip} from '../core';

export const Coll = protocol({
  empty: null,
  isEmpty: null,
  each: null,
  map: null,
  filter: null,
  find: null,
  reduce: null,
  append: null,
  toArray: null,
  toObject: null
});

export const toObject = Coll.toObject;
export const toArray = Coll.toArray;
export const reduce = flip(Coll.reduce, 3);
export const empty = Coll.empty;
export const each = flip(Coll.each, 2);
export const map = flip(Coll.map, 2);
export const filter = flip(Coll.filter, 2);
export const find = flip(Coll.find, 2);
export const append = flip(Coll.append, 2);
export default Coll;