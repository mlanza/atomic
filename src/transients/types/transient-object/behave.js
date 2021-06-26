import {does, overload, doto, forward} from "atomic/core";
import {implement} from "atomic/core";
import {transientObject} from "./construct.js";
import {ICoerceable, IEquiv, IFn, IComparable, IDescriptive, IMatchable, IFunctor, ILookup, IAssociative, IFind, IMapEntry, IYankable, ISeq, INext, ISeqable, ICounted, IInclusive, IEmptyableCollection, IMap, IReduce, IKVReduce, ICloneable, ISequential, ICollection} from "atomic/core";
import {IPersistent, ITransientYankable, ITransientAssociative, ITransientEmptyableCollection, ITransientCollection, ITransientMap} from "../../protocols.js";

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

export const behaveAsTransientObject = does(
  forward("obj", IMap, IMatchable, IFind, IInclusive, ILookup, ISeq, INext, IAssociative, ISeqable, ICounted, IReduce, IKVReduce, ICoerceable),
  implement(IDescriptive),
  implement(IPersistent, {persistent}),
  implement(ITransientCollection, {conj}),
  implement(IComparable, {compare}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ICoerceable, {toObject}),
  implement(IFn, {invoke: ILookup.lookup}),
  implement(ICloneable, {clone}),
  implement(ILookup, {lookup}),
  implement(ITransientAssociative, {assoc}),
  implement(IEquiv, {equiv}),
  implement(ITransientMap, {dissoc}));