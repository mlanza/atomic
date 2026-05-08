import {does, overload, identity, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {map, mapa, into} from "../lazy-seq/concrete.js";
import {hashSet, HashSet} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {IOmissible, IFunctor, IFn, ILookup, IMergable, ICloneable, IInclusive, ISet, ISeqable, ISeq, ICollection, ICounted, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";
import behave from "../set/behave.js";

function clone(self){
  return new HashSet(p.clone(self.coll));
}

function empty(){
  return hashSet();
}

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
  implement(IOmissible, {omit: disj}),
  implement(IMergable, {merge}),
  implement(ICollection, {conj}),
  implement(ISet, {disj, unite: conj}),
  implement(IInclusive, {includes}),
  implement(ILookup, {lookup}),
  implement(IFn, {invoke: lookup}),
  implement(IFunctor, {fmap}),
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
