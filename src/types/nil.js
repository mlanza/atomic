import {always, noop} from '../core';
import Hash from '../protocols/hash';
import Seq from '../protocols/seq';
import {extend} from '../protocol';
import {EMPTY} from '../types/empty.js';

export const get = always(null);

export function set(self, key, value){
  return Hash.set({}, key, value);
}

export const has = always(false);

export function isNil(value){
  return null == value;
}

extend(Seq, {
  seq: always(EMPTY)
}, null);

extend(Hash, {
  get: get,
  set: set,
  has: has
}, null);