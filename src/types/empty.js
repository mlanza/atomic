import {identity, constantly, noop} from '../core';
import {extend} from '../protocol';
import Deref from '../protocols/deref';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Reduced from '../types/reduced';
import List from '../types/list';

export function Empty(){
}

export const EMPTY = new Empty();

export function reduce(){
  return Deref.deref(arguments[2]);
}

export function conj(self, value){
  return new List(value, constantly(EMPTY));
}

export const seq = constantly(null);
export const first = constantly(null);
export const next = constantly(null);
export const rest = identity;
export const empty = identity;
export const cons = conj;

export default extend(Empty, Collection, {
  conj: conj,
  cons: cons
}, Emptyable, {
  empty: empty
}, Reduce, {
  reduce: reduce
}, Seqable, {
  seq: seq
}, Next, {
  next: next
}, Seq, {
  first: first,
  rest: rest
});