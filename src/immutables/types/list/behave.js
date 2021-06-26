import {does, identity, implement, iterable, unreduced, IEquiv, IInclusive, ILookup, IAssociative, IReduce, IMergable, ICoerceable, IEmptyableCollection, ICounted, ISeqable, ISeq, INext, ICollection, IClonable} from "atomic/core";

function equiv(self, other){
  return self.equals(other);
}

function includes(self, value){
  return self.includes(value);
}

function lookup(self, idx){
  return self.get(idx);
}

function assoc(self, idx, value){
  return self.set(idx, value);
}

function contains(self, idx){
  return self.has(idx);
}

function conj(self, value){
  return self.push(value);
}

function first(self){
  return self.first();
}

function rest(self){
  return self.rest();
}

function next(self){
  return ISeqable.seq(ISeq.rest(self));
}

function empty(self){
  return self.clear();
}

function count(self){
  return self.count();
}

function seq(self){
  return self.size ? self : null
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
  implement(IEquiv, {equiv}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ICoerceable, {toArray}),
  implement(IMergable, {merge}),
  implement(IEmptyableCollection, {empty}),
  implement(IClonable, {clone: identity}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}));