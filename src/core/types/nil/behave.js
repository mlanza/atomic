import {IHash, IMergable, IBlankable, ICompactible, IMap, IAssociative, IInclusive, IOtherwise, IForkable, ICoercible, IEquiv, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IKVReduce, IEmptyableCollection, IClonable} from "../../protocols.js";
import {emptyList} from "../empty-list/construct.js";
import {cons} from "../list/construct.js";
import {identity, constantly, does, overload, noop} from "../../core.js";
import {implement} from "../protocol.js";
import {emptyArray} from "../array/construct.js";
import {nil} from "./construct.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import {hash as hsh} from "hash";

function assoc(self, key, value){
  const obj = {};
  obj[key] = value;
  return obj;
}

function reduce(self, f, init){
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
  return p.count(xs) ? p.merge.apply(null, Array.from(xs)) : null;
}

function hash(self){
  return hsh(null);
}

export default does(
  naming("Nil"),
  implement(IHash, {hash}),
  implement(IClonable, {clone: identity}),
  implement(ICompactible, {compact: identity}),
  implement(ICollection, {conj}),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IMergable, {merge}),
  implement(IMap, {keys: nil, vals: nil, dissoc: nil}),
  implement(IForkable, {fork}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(ICoercible, {toArray: emptyArray}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IKVReduce, {reducekv: reduce}),
  implement(IReduce, {reduce}));
