import {does, overload} from '../../core';
import {IKVReduce, IReduce, ICoerceable, INext, ICounted, ISeq, ISeqable, ISequential, IIndexed, ILookup, IInclusive} from '../../protocols';
import {implement, implementing} from '../protocol';
import {indexedSeq} from '../indexed-seq/construct';
import {emptyList} from '../empty-list/construct';
import {some} from '../lazy-seq/concrete';
import {iterable} from '../lazy-seq/behave';
import {LazySeq} from '../lazy-seq/construct';

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

function includes(self, value){
  return !!some(function(x){
    return x === value;
  }, self);
}

export const behaveAsIndexed = does(
  iterable,
  implementing([IKVReduce, IReduce], LazySeq),
  implement(ISequential),
  implement(IInclusive, {includes}),
  implement(IIndexed, {nth}),
  implement(ILookup, {lookup: nth}),
  implement(INext, {next}),
  implement(ICoerceable, {toArray: Array.from}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));