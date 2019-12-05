import {does, identity, implement, iterable, IEmptyableCollection, ICounted, ISeqable, ISeq, ICollection, ICloneable} from "atomic/core";

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

export const behaveAsList = does(
  iterable,
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone: identity}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}));