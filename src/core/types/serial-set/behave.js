import {serialSet, SerialSet} from "./construct.js"
import {chain, does} from "../../core.js";
import {maybe} from  "../just/construct.js";
import {iterable, reductive} from "../lazy-seq/behave.js";
import {map} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import {reduceWith} from "../../shared.js";
import * as p from "../../protocols/concrete.js";
import {ILookup, IReducible, IInclusive, ISeqable, ICollection, ISeq, ISet, IEmptyableCollection} from "../../protocols.js";

function first(self){
  return maybe(self, p.seq, p.first);
}

function rest(self){
  return maybe(self, p.seq, p.rest);
}

function conj(self, value){
  return new SerialSet(p.assoc(self.coll, self.serialize(value), value), self.serialize);
}

function disj(self, value){
  return new SerialSet(p.dissoc(self.coll, self.serialize(value)), self.serialize);
}

function includes(self, value){
  return p.contains(self.coll, self.serialize(value));
}

function seq(self){
  return p.seq(self.coll) ? p.vals(self.coll) : null;
}

function empty(self){
  return serialSet([], self.serialize);
}

const reduce = reduceWith(seq);

export default does(
  iterable,
  reductive,
  implement(IReducible, {reduce}),
  implement(ISeq, {first, rest}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISet, {disj}),
  implement(IInclusive, {includes}),
  implement(ISeqable, {seq}));
