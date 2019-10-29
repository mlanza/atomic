import {does, overload, doto, forwardTo, implement, deprecated} from "atomic/core";
import {ICoerce, IInsertable, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IReversible, IEmptyableCollection, IMap, IReduce, IKVReduce, ICloneable, IAppendable, IPrependable, ITemplate, ISequential, ICollection} from "atomic/core";
import {transientArray} from "./construct";
import {IPersistent, ITransientReversible, ITransientYankable, ITransientAssociative, ITransientAppendable, ITransientPrependable, ITransientCollection, ITransientInsertable} from "../../protocols";

function _before(self, reference, inserted){
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos, 0, inserted);
}

function before(self, reference, inserted){
  deprecated(self, "IInsertable.before deprecated. Use ITransientInsertable.before.");
  _before(self, reference, inserted);
  return self;
}

function _after(self, reference, inserted){
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos + 1, 0, inserted);
}

function after(self, reference, inserted){
  deprecated(self, "IInsertable.after deprecated. Use ITransientInsertable.after.");
  _after(self, reference, inserted);
  return self;
}

function seq(self){
  return self.arr.length ? self : null;
}

function _append(self, value){
  self.arr.push(value);
}

function append(self, value){
  deprecated(self, "IAppendable.append deprecated. Use ITransientAppendable.append.");
  _append(self, value);
  return self;
}

function _prepend(self, value){
  self.arr.unshift(value);
}

function prepend(self, value){
  deprecated(self, "IPrependable.prepend deprecated. Use ITransientPrependable.prepend.");
  _prepend(self, value);
  return self;
}

function empty(){
  return transientArray([]);
}

function _reverse(self){
  self.arr.reverse();
}

function reverse(self){
  deprecated(self, "IReversible.reverse deprecated. Use ITransientReversile.reverse.");
  _reverse(self);
  return self;
}

function _assoc(self, idx, value){
  self.arr[idx] = value;
}

function assoc(self, idx, value){
  deprecated(self, "IAssociative.assoc deprecated. Use ITransientAssociative.assoc.");
  _assoc(self, idx, value);
  return self;
}

function _dissoc(self, idx){
  self.arr.splice(idx, 1);
}

function dissoc(self, idx){
  deprecated(self, "IMap.dissoc deprecated. Use IMap.dissoc.");
  _dissoc(self, idx);
  return self;
}

function _yank(self, value){
  let pos;
  while ((pos = self.arr.indexOf(value)) > -1) {
    self.arr.splice(pos, 1);
  }
}

function yank(self, value){
  deprecated(self, "IYankable.yank deprecated. Use ITransientYank.yank.");
  _yank(self, value);
  return self;
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
const toObject = forward(ICoerce.toObject);
const lookup = forward(ILookup.lookup);
const reduce = forward(IReduce.reduce);
const reducekv = forward(IKVReduce.reducekv);
const fill = forward(ITemplate.fill);
const fmap = forward(IFunctor.fmap);
const includes = forward(IInclusive.includes);
const count = forward(ICounted.count);
const first = forward(ISeq.first);
const rest = forward(ISeq.rest);
const next = forward(INext.next);

export default does(
  implement(ISequential),
  implement(IPersistent, {persistent}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ICounted, {count}),
  implement(ITransientInsertable, {before: _before, after: _after}),
  implement(IInsertable, {before, after}),
  implement(ICollection, {conj: append}),
  implement(IEmptyableCollection, {empty}),
  implement(IFind, {find}),
  implement(IYankable, {yank}),
  implement(ITransientYankable, {yank: _yank}),
  implement(IMapEntry, {key, val}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains, assoc}),
  implement(ITransientAssociative, {assoc: _assoc}),
  implement(IReversible, {reverse}),
  implement(ITransientReversible, {reverse: _reverse}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ICoerce, {toObject}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ITransientAppendable, {append: _append}),
  implement(ITransientPrependable, {prepend: _prepend}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ITemplate, {fill}),
  implement(IFunctor, {fmap}));