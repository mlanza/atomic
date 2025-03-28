import {does, overload, identity, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {map, mapa, into} from "../lazy-seq/concrete.js";
import {hashSet, HashSet} from "./construct.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";
import {reduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {reduce, reducekv} from "../../shared.js";
import {IHashable, IFunctor, IFn, ILookup, IMergable, ICloneable, IEquiv, IInclusive, ISet, ISeqable, ISeq, ICollection, ICounted, IEmptyableCollection, IReducible, IKVReducible} from "../../protocols.js";
import * as p from "./protocols.js";
import behave from "../set/behave.js";

function clone(self){
  return new HashSet(p.clone(self.coll));
}

const empty = constantly(hashSet());

function disj(self, value){
  return includes(self, value) ? new HashSet(p.dissoc(self.coll, value)) : self;
}

function includes(self, value){
  return p.contains(self.coll, value);
}

function lookup(self, value){
  return p.contains(self.coll, value) ? value : null;
}

function conj(self, value){
  return includes(self, value) ? self : new HashSet(p.assoc(self.coll, value, value));
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

const merge = into;

function fmap(self, f){
  return hashSet(mapa(f, self));
}

export default does(
  behave,
  keying("HashSet"),
  implement(IMergable, {merge}),
  implement(ICollection, {conj}),
  implement(ISet, {disj}),
  implement(IEquiv, {equiv}),
  implement(IInclusive, {includes}),
  implement(ILookup, {lookup}),
  implement(IFn, {invoke: lookup}),
  implement(IFunctor, {fmap}),
  implement(IHashable, {hash}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
