import * as _ from "atomic/core";
import {IPersistent, ITransientMap, ITransientInsertable, ITransientEmptyableCollection, ITransientReversible, ITransientOmissible, ITransientAssociative, ITransientAppendable, ITransientPrependable, ITransientCollection} from "../../protocols.js";

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

function omit(self, value){
  let pos;
  while ((pos = self.arr.indexOf(value)) > -1) {
    self.arr.splice(pos, 1);
  }
}

function clone(self){
  return new self.constructor(_.clone(self.arr));
}

function persistent(self){
  const arr = self.arr;
  delete self.arr;
  return arr;
}

export default _.does(
  _.forward("arr", _.IFind, _.IMapEntry, _.IAssociative, _.IMap, _.ICoercible, _.ILookup, _.IReduce, _.IKVReduce, _.IFunctor, _.IInclusive, _.ICounted, _.ISeq, _.INext),
  _.implement(_.ISequential),
  _.implement(_.IClonable, {clone}),
  _.implement(_.ISeqable, {seq}),
  _.implement(IPersistent, {persistent}),
  _.implement(ITransientInsertable, {before, after}),
  _.implement(ITransientCollection, {conj: append, unconj}),
  _.implement(ITransientEmptyableCollection, {empty}),
  _.implement(ITransientOmissible, {omit}),
  _.implement(ITransientAssociative, {assoc}),
  _.implement(ITransientReversible, {reverse}),
  _.implement(ITransientMap, {dissoc}),
  _.implement(ITransientAppendable, {append}),
  _.implement(ITransientPrependable, {prepend}));
