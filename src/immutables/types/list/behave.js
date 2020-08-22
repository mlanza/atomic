import {does, identity, implement, iterable, unreduced, IReduce, IMergeable, ICoerceable, IEmptyableCollection, ICounted, ISeqable, ISeq, ICollection, ICloneable} from "atomic/core";

function conj(self, value){
  return self.push(value);
}

function first(self){
  return self.first();
}

function rest(self){
  return self.rest();
}

function empty(self){
  return self.clear();
}

function count(self){
  return self.count();
}

function seq(self){
  return first(self) ? self : null
}

function toArray(self){
  return self.toArray();
}

function reduce(self, xf, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = xf(memo, first(coll));
    coll = next(coll);
  }
  return unreduced(memo);
}

function merge(self, other){
  return reduce(other, _.conj, self);
}

export const behaveAsList = does(
  iterable,
  implement(IReduce, {reduce}),
  implement(ICoerceable, {toArray}),
  implement(IMergeable, {merge}),
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone: identity}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}));