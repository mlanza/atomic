import {does, overload, identity, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {hash} from "../../protocols/ihashable/concrete.js";
import {detectIndex, filtera, map, mapcat, into} from "../lazy-seq/concrete.js";
import {assocIn} from "../../protocols/iassociative/concrete.js";
import {getIn} from "../../protocols/ilookup/concrete.js";
import {persistentMap, PersistentMap} from "./construct.js";
import {reduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {reduceWith, reducekvWith} from "../../shared.js";
import {IMergable, ICollection, ICloneable, IEquiv, IKVReducible, IReducible, ISeq, ISeqable, ILookup, IAssociative, ICounted, IMap, IInclusive, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";

function getHashIndex(self, key){
  const h = hash(key);
  const candidates = self.mapped[h] || null;
  const idx = detectIndex(function([k, v]){
    return self.equals(key, k);
  }, candidates);
  return {h, idx, candidates};
}

function clone(self){
  return new PersistentMap(p.clone(self.mapped), self.length, self.equals);
}

const empty = constantly(persistentMap());

function conj(self, [key, value]){
  return assoc(self, key, value);
}

function assoc(self, key, value){
  const {h, idx, candidates} = getHashIndex(self, key);
  const mapped = !candidates ?
    p.assoc(self.mapped, h, [[key, value]]) :
    idx == null ? p.update(self.mapped, h, p.conj(?, [key, value])) : p.assocIn(self.mapped, [h, idx], [key, value]);
  const length = idx == null ? self.length + 1 : self.length;
  return new PersistentMap(mapped, length, self.equals);
}

function lookup(self, key){
  const {h, idx} = getHashIndex(self, key);
  return idx == null ? null : getIn(self.mapped, [h, idx, 1]);
}

function count(self){
  return self.length;
}

function dissoc(self, key){
  const {h, idx, candidates} = getHashIndex(self, key);
  if (idx == null) {
    return self;
  }
  if (p.count(candidates) === 1) {
    return new PersistentMap(p.dissoc(self.mapped, h), self.length - 1, self.equals);
  }
  return new PersistentMap(p.assoc(self.mapped, h, filtera(function([k, v]){
    return !self.equals(key, k);
  }, candidates)), self.length - 1, self.equals);
}

function keys(self){
  return mapcat(map(([key, _]) => key, ?), p.vals(self.mapped));
}

function vals(self){
  return mapcat(map(([_, val]) => val, ?), p.vals(self.mapped));
}

function contains(self, key) {
  const {idx} = getHashIndex(self, key);
  return idx != null;
}

function includes(self, [key, val]){
  return contains(self, key) && self.equals(val, lookup(self, key));
}

function seq(self){
  return self.length > 0 ? mapcat(identity, p.vals(self.mapped)) : null;
}

function equiv(self, other){
  return count(self) === p.count(other) && reduce(self, function(memo, pair){
    return memo && p.includes(other, pair) ? true : reduced(false);
  }, true);
}

function first(self){
  return p.first(seq(self));
}

function rest(self){
  return p.rest(seq(self));
}

function merge(self, other){
  return into(self, other);
}

const reduce = reduceWith(seq);
const reducekv = reducekvWith(seq);

export default does(
  keying("PersistentMap"),
  implement(IMergable, {merge}),
  implement(ICollection, {conj}),
  implement(IEmptyableCollection, {empty}),
  implement(IEquiv, {equiv}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ICloneable, {clone}),
  implement(IInclusive, {includes}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ICounted, {count})
);
