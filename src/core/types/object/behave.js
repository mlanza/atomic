import {does, identity, constructs, branch, overload, comp, chain} from "../../core.js";
import {implement} from "../protocol.js";
import {ITopic, IHashable, IMergable, ICompactible, IOmissible, ICollection, IEquiv, IReducible, IKVReducible, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, ICloneable, IInclusive} from "../../protocols.js";
import {reduced} from "../reduced.js";
import {lazySeq, into, map, mapcat} from "../lazy-seq.js";
import {cons} from "../list.js";
import {apply} from "../function/concrete.js";
import {satisfies} from "../protocol/concrete.js";
import {update} from "../../protocols/iassociative/concrete.js";
import {emptyList} from "../empty-list/construct.js";
import {emptyObject} from "../object/construct.js";
import {descriptive} from "../object/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashKeyed as hash} from "../../protocols/ihashable/hashers.js";
import {reduceWith, reducekvWith} from "../../shared.js";
import * as p from "./protocols.js";

const keys = Object.keys;
const vals = Object.values;

function first(self){
  return p.first(p.seq(self));
}

function rest(self){
  return p.rest(p.seq(self));
}

const merge = into;

function compact(self){
  return p.reducekv(function(memo, key, value){
    return value == null ? memo : p.assoc(memo, key, value);
  }, p.empty(self), self);
}

function omit(self, entry){
  const key = p.key(entry);
  if (p.includes(self, entry)) {
    const result = p.clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function conj(self, [key, value]){
  return p.assoc(self, key, value);
}

function equiv(self, other){
  return descriptive(other) && p.count(p.keys(self)) === p.count(p.keys(other)) && p.reduce(function(memo, key){
    return memo ? p.equiv(p.get(self, key), p.get(other, key)) : reduced(memo);
  }, true, p.keys(self));
}

function find(self, key){
  return p.contains(self, key) ? [key, p.get(self, key)] : null;
}

function includes(self, [key, value]){
  return p.contains(self, key, value);
}

function lookup(self, key){
  return self[key];
}

function dissoc(self, key){
  if (p.contains(self, key)) {
    const result = p.clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function assoc(self, key, value){
  if (p.get(self, key) === value) {
    return self;
  } else {
    const result = p.clone(self);
    result[key] = value;
    return result;
  }
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function seq(self){
  return p.count(self) ? map(function(key){
    return [key, p.get(self, key)];
  }, p.keys(self)) : null;
}

function clone(self){
  return Object.assign({}, self);
}

function assert2(self, key){
  return p.contains(self, key) ? [[key, p.get(self, key)]] : null;
}

function assert1(self){
  return p.seq(mapcat(assert2(self, ?), p.keys(self)));
}

export const assert = overload(null, assert1, assert2, p.assoc);

function retract3(self, key, value){
  return p.equiv(p.get(self, key), value) ? p.dissoc(self, key) : self;
}

export const retract = overload(null, null, p.dissoc, retract3);

const reduce = reduceWith(p.seq);
const reducekv = reducekvWith(p.seq);
const count = comp(p.count, p.keys);

export default does(
  keying("Object"),
  implement(IHashable, {hash}),
  implement(IMergable, {merge}),
  implement(ICompactible, {compact}),
  implement(IEquiv, {equiv}),
  implement(IFind, {find}),
  implement(IOmissible, {omit}),
  implement(IInclusive, {includes}),
  implement(ICollection, {conj}),
  implement(ICloneable, {clone}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IFn, {invoke: lookup}),
  implement(ISeq, {first, rest}),
  implement(ILookup, {lookup}),
  implement(ITopic, {assert, retract}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
