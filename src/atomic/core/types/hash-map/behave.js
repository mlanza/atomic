import {does, overload, identity, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {hash} from "../../protocols/ihashable/concrete.js";
import {detectIndex, filtera, map, mapcat} from "../lazy-seq/concrete.js";
import {assocIn} from "../../protocols/iassociative/concrete.js";
import {getIn} from "../../protocols/ilookup/concrete.js";
import {hashMap, HashMap} from "./construct.js";
import {reduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {ICounted, ICloneable, ISeqable, ILookup, IAssociative, IMap, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";
import behave from "../object/behave.js";

function getHashIndex(self, key){
  const h = hash(key);
  const candidates = self.mapped[h] || null;
  const idx = detectIndex(function([k, v]){
    return self.equals(key, k);
  }, candidates);
  return {h, idx, candidates};
}

function clone(self){
  return new HashMap(p.clone(self.mapped), self.length, self.equals);
}

function empty(){
  return hashMap();
}

function assoc(self, key, value){
  const {h, idx, candidates} = getHashIndex(self, key);
  const mapped = !candidates ?
    p.assoc(self.mapped, h, [[key, value]]) :
    idx == null ? p.update(self.mapped, h, p.conj(?, [key, value])) : p.assocIn(self.mapped, [h, idx], [key, value]);
  const length = idx == null ? self.length + 1 : self.length;
  return new HashMap(mapped, length, self.equals);
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
    return new HashMap(p.dissoc(self.mapped, h), self.length - 1, self.equals);
  }
  return new HashMap(p.assoc(self.mapped, h, filtera(function([k, v]){
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

function seq(self){
  return self.length ? mapcat(identity, p.vals(self.mapped)) : null;
}

export default does(
  behave,
  keying("HashMap"),
  implement(ICounted, {count}),
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone}),
  implement(ISeqable, {seq}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IMap, {dissoc, keys, vals}));
