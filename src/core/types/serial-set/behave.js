import {serialSet, SerialSet} from "./construct.js"
import {keying} from "../../protocols/imapentry/concrete.js";
import {chain, does} from "../../core.js";
import {maybe} from  "../just/construct.js";
import {mapa} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import * as p from "../../protocols/concrete.js";
import {ICloneable, IMergable, IFunctor, IFn, ILookup, IInclusive, ISeqable, ICollection, ISeq, ISet, IEmptyableCollection} from "../../protocols.js";
import behave from "../set/behave.js";

function first(self){
  return maybe(self, p.seq, p.first);
}

function rest(self){
  return maybe(self, p.seq, p.rest);
}

function conj(self, value){
  return serialSet(p.assoc(self.coll, self.serialize(value), value), self.serialize);
}

function disj(self, value){
  return serialSet(p.dissoc(self.coll, self.serialize(value)), self.serialize);
}

function includes(self, value){
  return p.contains(self.coll, self.serialize(value));
}

function lookup(self, value){
  return includes(self, value) ? value : null;
}

function seq(self){
  return p.seq(self.coll) ? p.vals(self.coll) : null;
}

function empty(self){
  return serialSet([], self.serialize);
}

function clone(self){
  return serialSet([...self], self.serialize);
}

function merge(self, other){
  return new self.constructor([...self, ...other], self.serialize);
}

function fmap(self, f){
  return serialSet(mapa(f, self), self.serialize);
}

export default does(
  behave,
  keying("SerialSet"),
  implement(ISeq, {first, rest}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISet, {disj, unite: conj}),
  implement(IInclusive, {includes}),
  implement(ILookup, {lookup}),
  implement(IFn, {invoke: lookup}),
  implement(IFunctor, {fmap}),
  implement(IMergable, {merge}),
  implement(ICloneable, {clone}),
  implement(ISeqable, {seq}));
