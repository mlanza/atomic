import {does, overload, doto, forwardTo, implement} from "atomic/core";
import {ICoerceable, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IEmptyableCollection, IMap, IReduce, IKVReduce, ICloneable, ISequential, ICollection} from "atomic/core";
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
  return new self.constructor(ICloneable.clone(self.arr));
}

function persistent(self){
  const arr = self.arr;
  delete self.arr;
  return arr;
}

const forward = forwardTo("arr");
const find = forward(IFind.find);
const key = forward(IMapEntry.key);
const val = forward(IMapEntry.val);
const contains = forward(IAssociative.contains);
const keys = forward(IMap.keys);
const vals = forward(IMap.vals);
const toObject = forward(ICoerceable.toObject);
const lookup = forward(ILookup.lookup);
const reduce = forward(IReduce.reduce);
const reducekv = forward(IKVReduce.reducekv);
const fmap = forward(IFunctor.fmap);
const includes = forward(IInclusive.includes);
const count = forward(ICounted.count);
const first = forward(ISeq.first);
const rest = forward(ISeq.rest);
const next = forward(INext.next);

export const behaveAsTransientArray = does(
  implement(ISequential),
  implement(ICloneable, {clone}),
  implement(IPersistent, {persistent}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ICounted, {count}),
  implement(ITransientInsertable, {before, after}),
  implement(ITransientCollection, {conj: append, unconj}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(IFind, {find}),
  implement(ITransientYankable, {yank}),
  implement(IMapEntry, {key, val}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains}),
  implement(ITransientAssociative, {assoc}),
  implement(ITransientReversible, {reverse}),
  implement(ITransientMap, {dissoc}),
  implement(IMap, {keys, vals}),
  implement(ICoerceable, {toObject}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ITransientAppendable, {append}),
  implement(ITransientPrependable, {prepend}),
  implement(IFunctor, {fmap}));