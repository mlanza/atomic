import {effect, overload, doto} from '../../core';
import {implement, forwardTo} from '../../types/protocol';
import {transientArray} from "./construct";
import {IObject, IInsertable, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYank, ISeq, INext, ISeqable, ICounted, IInclusive, IReversible, IEmptyableCollection, IMap, IPersistent, IReduce, IKVReduce, ICloneable, IAppendable, IPrependable, ITemplate, ISequential, ICollection} from '../../protocols';

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

function empty(){
  return transientArray([]);
}

function reverse(self){
  self.arr.reverse();
}

function assoc(self, idx, value){
  self.arr[idx] = value;
}

function yank(self, value){
  let pos;
  while ((pos = self.arr.indexOf(value)) > -1) {
    self.arr.splice(pos, 1);
  }
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
const toObject = forward(IObject.toObject);
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

export default effect(
  implement(ISequential),
  implement(IPersistent, {persistent}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ICounted, {count}),
  implement(IInsertable, {before, after}),
  implement(ICollection, {conj: append}),
  implement(IEmptyableCollection, {empty}),
  implement(IFind, {find}),
  implement(IYank, {yank}),
  implement(IMapEntry, {key, val}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains, assoc}),
  implement(IReversible, {reverse}),
  implement(IMap, {keys, vals}),
  implement(IObject, {toObject}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ITemplate, {fill}),
  implement(IFunctor, {fmap}));