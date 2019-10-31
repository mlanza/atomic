import {does, overload, doto, forwardTo} from "atomic/core";
import {implement} from "atomic/core";
import {transientObject} from "./construct";
import {ICoerce, IEquiv, IFn, IComparable, IDescriptive, IMatch, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IEmptyableCollection, IMap, IReduce, IKVReduce, ICloneable, ITemplate, ISequential, ICollection} from "atomic/core";
import {IPersistent, ITransientYankable, ITransientAssociative, ITransientEmptyableCollection, ITransientCollection, ITransientMap} from "../../protocols";

function yank(self, entry){
  const key = IMapEntry.key(entry);
  if (includes(self, entry)) {
    delete self.obj[key];
  }
}

function conj(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  self.obj[key] = val;
}

function dissoc(self, key){
  if (contains(self, key)) {
    delete self.obj[key];
  }
}

function assoc(self, key, value){
  if (!contains(self, key) || !IEquiv.equiv(lookup(self, key), value)) {
    self.obj[key] = value;
  }
}

function clone(self){
  return transientObject(ICloneable.clone(self.obj));
}

function compare(a, b){
  return IComparable.compare(a.obj, b == null ? null : b.obj);
}

function equiv(a, b){
  return IEquiv.equiv(a.obj, b == null ? null : b.obj);
}

function toObject(self){
  return self.obj;
}

function empty(self){
  self.obj = {};
}

function persistent(self){
  const obj = self.obj;
  delete self.obj;
  return obj;
}

const forward = forwardTo("obj");
const keys = forward(IMap.keys);
const vals = forward(IMap.vals);
const matches = forward(IMatch.matches);
const find = forward(IFind.find);
const includes = forward(IInclusive.includes);
const lookup = forward(ILookup.lookup);
const first = forward(ISeq.first);
const rest = forward(ISeq.rest);
const next = forward(INext.next);
const contains = forward(IAssociative.contains);
const seq = forward(ISeqable.seq);
const count = forward(ICounted.count);
const reduce = forward(IReduce.reduce);
const reducekv = forward(IKVReduce.reducekv);
const toArray = forward(ICoerce.toArray);

export default does(
  implement(IDescriptive),
  implement(IPersistent, {persistent}),
  implement(ITransientCollection, {conj}),
  implement(IComparable, {compare}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ICoerce, {toArray, toObject}),
  implement(IFn, {invoke: lookup}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ICounted, {count}),
  implement(ICloneable, {clone}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(IFind, {find}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains}),
  implement(ITransientAssociative, {assoc}),
  implement(IInclusive, {includes}),
  implement(IEquiv, {equiv}),
  implement(IMap, {keys, vals}),
  implement(ITransientMap, {dissoc}),
  implement(IMatch, {matches}));