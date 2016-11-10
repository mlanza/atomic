import {protocol} from '../protocol.js';
import {flip} from '../core';

export const Hash = protocol({
  get: null,
  set: null,
  has: null
});

export const get = flip(Hash.get, 2);
export const set = flip(Hash.set, 3);
export const has = flip(Hash.has, 2);
export default Hash;