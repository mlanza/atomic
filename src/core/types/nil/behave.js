import {IMergeable, IBlankable, ICompactable, IMap, IAssociative, IInclusive, IOtherwise, IForkable, ICoerceable, IEquiv, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IKVReduce, IEmptyableCollection, ISequential, ICloneable} from "../../protocols.js";
import {emptyList} from "../empty-list/construct.js";
import {cons} from "../list/construct.js";
import {identity, constantly, does, overload, noop} from "../../core.js";
import {implement} from "../protocol.js";
import {emptyArray} from "../array/construct.js";
import {nil} from "./construct.js";

function assoc(self, key, value){
  const obj = {};
  obj[key] = value;
  return obj;
}

function reduce(self, xf, init){
  return init;
}

function equiv(self, other){
  return null == other;
}

function otherwise(self, other){
  return other;
}

function fork(self, reject, resolve){
  return reject(self);
}

function conj(self, value){
  return cons(value);
}

function merge(self, ...xs){
  return ICounted.count(xs) ? IMergeable.merge.apply(null, Array.from(xs)) : null;
}

export const behaveAsNil = does(
  implement(ICloneable, {clone: identity}),
  implement(ICompactable, {compact: identity}),
  implement(ICollection, {conj}),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IMergeable, {merge}),
  implement(IMap, {keys: nil, vals: nil, dissoc: nil}),
  implement(IForkable, {fork}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(ICoerceable, {toArray: emptyArray}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IKVReduce, {reducekv: reduce}),
  implement(IReduce, {reduce}));