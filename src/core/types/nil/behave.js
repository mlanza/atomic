import {ITopic, IHashable, IMergable, ICompactible, IMap, IAssociative, IInclusive, IOtherwise, IEquiv, ICollection, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReducible, IKVReducible, IEmptyableCollection, ICloneable} from "../../protocols.js";
import {emptyList} from "../empty-list/construct.js";
import {cons} from "../list/construct.js";
import {identity, constantly, does, overload, noop} from "../../core.js";
import {implement} from "../protocol.js";
import {emptyArray} from "../array/construct.js";
import {nil} from "./construct.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

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

function conj(self, value){
  return cons(value);
}

function merge(self, ...xs){
  return p.count(xs) ? p.merge.apply(null, Array.from(xs)) : null;
}

function hash(self){
  return 0;
}

const assert = overload(null, identity, identity, assoc);
const retract = identity;

export default does(
  keying("Nil"),
  implement(ITopic, {assert, retract}),
  implement(IHashable, {hash}),
  implement(ICloneable, {clone: identity}),
  implement(ICompactible, {compact: identity}),
  implement(ICollection, {conj}),
  implement(IMergable, {merge}),
  implement(IMap, {keys: nil, vals: nil, dissoc: nil}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IKVReducible, {reducekv: reduce}),
  implement(IReducible, {reduce}));
