import {does, overload, identity, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {map, into} from "../lazy-seq/concrete.js";
import {persistentSet, PersistentSet} from "./construct.js";
import {reduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {reduce, reducekv} from "../../shared.js";
import {IMergable, ICloneable, IEquiv, IInclusive, ISet, ISeqable, ISeq, ICollection, ICounted, IEmptyableCollection, IReducible, IKVReducible} from "../../protocols.js";
import * as p from "./protocols.js";

function clone(self){
  return new PersistentSet(p.clone(self.coll));
}

const empty = constantly(persistentSet());

function disj(self, value){
  return includes(self, value) ? new PersistentSet(p.dissoc(self.coll, value)) : self;
}

function includes(self, value){
  return p.contains(self.coll, value);
}

function conj(self, value){
  return includes(self, value) ? self : new PersistentSet(p.assoc(self.coll, value, value));
}

function count(self){
  return p.count(self.coll);
}

function seq(self){
  return p.count(self.coll) ? map(p.first, p.seq(self.coll)) : null;
}

function equiv(self, other){
  return count(self) === p.count(other) && reduce(self, function(memo, value){
    return memo && p.includes(other, value) ? true : reduced(false);
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

export default does(
  keying("PersistentSet"),
  implement(IMergable, {merge}),
  implement(ICollection, {conj}),
  implement(ISet, {disj}),
  implement(IEquiv, {equiv}),
  implement(IInclusive, {includes}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count})
);
