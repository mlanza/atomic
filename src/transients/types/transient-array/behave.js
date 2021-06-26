import {does, overload, doto, forward, implement} from "atomic/core";
import {ICoerceable, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IEmptyableCollection, IMap, IReduce, IKVReduce, IClonable, ISequential, ICollection} from "atomic/core";
import {IPersistent, ITransientMap, ITransientInsertable, ITransientEmptyableCollection, ITransientReversible, ITransientYankable, ITransientAssociative, ITransientAppendable, ITransientPrependable, ITransientCollection} from "../../protocols.js";

function before(self, reference, inserted){
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos, 0, inserted);
}

function after(self, reference, inserted){
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos + 1, 0, inserted);
}

function seq(self){
  return self.arr.length ? self : null;
}

function append(self, value){
  self.arr.push(value);
}

function prepend(self, value){
  self.arr.unshift(value);
}

function unconj(self, value){
  const pos = self.arr.lastIndexOf(value);
  if (pos > -1) {
    self.arr.splice(pos, 1);
  }
}

function empty(self){
  self.arr = [];
}

function reverse(self){
  self.arr.reverse();
}

function assoc(self, idx, value){
  self.arr[idx] = value;
}

function dissoc(self, idx){
  self.arr.splice(idx, 1);
}

function yank(self, value){
  let pos;
  while ((pos = self.arr.indexOf(value)) > -1) {
    self.arr.splice(pos, 1);
  }
}

function clone(self){
  return new self.constructor(IClonable.clone(self.arr));
}

function persistent(self){
  const arr = self.arr;
  delete self.arr;
  return arr;
}

export const behaveAsTransientArray = does(
  forward("arr", IFind, IMapEntry, IAssociative, IMap, ICoerceable, ILookup, IReduce, IKVReduce, IFunctor, IInclusive, ICounted, ISeq, INext),
  implement(ISequential),
  implement(IClonable, {clone}),
  implement(IPersistent, {persistent}),
  implement(ISeqable, {seq}),
  implement(ITransientInsertable, {before, after}),
  implement(ITransientCollection, {conj: append, unconj}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ITransientYankable, {yank}),
  implement(ITransientAssociative, {assoc}),
  implement(ITransientReversible, {reverse}),
  implement(ITransientMap, {dissoc}),
  implement(ITransientAppendable, {append}),
  implement(ITransientPrependable, {prepend}));