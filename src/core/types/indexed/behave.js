import {identity, does, overload} from '../../core';
import {ICoerce, INext, ICounted, ISeq, ISeqable, ISequential, IIndexed, ILookup} from '../../protocols';
import {implement} from '../protocol';
import {indexedSeq} from '../indexed-seq/construct';
import {emptyList} from '../empty-list/construct';
import {iterable} from '../lazy-seq/behave';

function count(self){
  return self.obj.length;
}

function nth(self, idx){
  return self.obj[idx];
}

function first(self) {
  return nth(self, 0);
}

function rest(self){
  return next(self) || emptyList();
}

function next(self){
  return count(self) > 1 ? indexedSeq(self, 1) : null;
}

function seq(self) {
  return count(self) ? self : null;
}

function toArray(self){
  return Array.from(self);
}

export default does(
  iterable,
  implement(ISequential),
  implement(IIndexed, {nth}),
  implement(ILookup, {lookup: nth}),
  implement(INext, {next}),
  implement(ICoerce, {toArray}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));