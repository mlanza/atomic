import {does, overload, doto, forwardTo} from "atomic/core";
import {implement} from "atomic/core";
import {transientObject} from "./construct";
import {ICoerce, IEquiv, IFn, IComparable, IDescriptive, IInsertable, IMatch, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IReversible, IEmptyableCollection, IMap, IReduce, IKVReduce, ICloneable, IAppendable, IPrependable, ITemplate, ISequential, ICollection} from "atomic/core";
import {IPersistent, ITransientYankable, ITransientAssociative, ITransientCollection, ITransientMap} from "../../protocols";

function _yank(self, entry){
  const key = IMapEntry.key(entry);
  if (includes(self, entry)) {
    delete self.obj[key];
  }
}

function yank(self, entry){
  deprecated(self, "IYankable.yank deprecated. Use ITransientYankable.yank.");
  _yank(self, entry);
  return self;
}

function _conj(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  self.obj[key] = val;
}

function conj(self, entry){
  deprecated(self, "ICollection.conj deprecated. Use ITransientCollection.conj.");
  _conj(self, entry);
  return self;
}

function _dissoc(self, key){
  if (contains(self, key)) {
    delete self.obj[key];
  }
}

function dissoc(self, key){
  deprecated(self, "IMap.dissoc deprecated. Use ITransientMap.dissoc.");
  _dissoc(self, key);
  return self;
}

function _assoc(self, key, value){
  if (!contains(self, key) || !IEquiv.equiv(lookup(self, key), value)) {
    self.obj[key] = value;
  }
}

function assoc(self, key, value){
  deprecated(self, "IAssociative.assoc deprecated. Use ITransientAssociative.assoc.");
  _assoc(self, key, value);
  return self;
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
  return self;
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
  implement(ICollection, {conj}),
  implement(ITransientCollection, {conj: _conj}),
  implement(IComparable, {compare}),
  implement(IEmptyableCollection, {empty}),
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
  implement(IAssociative, {assoc, contains}),
  implement(ITransientAssociative, {assoc: _assoc}),
  implement(IInclusive, {includes}),
  implement(IEquiv, {equiv}),
  implement(IMap, {keys, vals, dissoc}),
  implement(ITransientMap, {dissoc: _dissoc}),
  implement(IMatch, {matches}));