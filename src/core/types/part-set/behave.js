import {partSet, PartSet} from "./construct.js"
import {keying} from "../../protocols/imapentry/concrete.js";
import {chain, does} from "../../core.js";
import {maybe} from  "../just/construct.js";
import {map, concatenated} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import * as p from "../../protocols/concrete.js";
import {IFn, ILookup, ICollection, IEmptyableCollection, IInclusive, ISet, ISeq, ISeqable} from "../../protocols.js";
import behave from "../set/behave.js";

function conj(self, value){
  const part = self.partition(value);
  return new PartSet(self.partition, self.store, chain(
    p.contains(self.parts, part) ? self.parts : p.assoc(self.parts, part, self.store(value)),
    p.update(?, part, p.conj(?, value))));
}

function disj(self, value){
  const part = self.partition(value);
  return new PartSet(self.partition, self.store,
    p.contains(self.parts, part) ? p.update(self.parts, part, p.disj(?, value)) : self.parts);
}

function includes(self, value){
  const part = self.partition(value);
  return maybe(self.parts, p.get(?, part), p.includes(?, value));
}

function lookup(self, value){
  return includes(self, value) ? value : null;
}

function seq(self){
  return p.seq(concatenated(map(function(parts){
    return p.seq(parts);
  }, p.vals(self.parts))));
}

function first(self){
  const xs = seq(self);
  return p.first(xs);
}

function rest(self){
  const xs = seq(self);
  return p.rest(xs);
}

function empty(self){
  return new PartSet(self.partition, self.store, p.empty(self.parts));
}

export default does(
  behave,
  keying("PartSet"),
  implement(ISeq, {first, rest}),
  implement(ICollection, {conj}),
  implement(IEmptyableCollection, {empty}),
  implement(ISet, {disj, unite: conj}),
  implement(IInclusive, {includes}),
  implement(ILookup, {lookup}),
  implement(IFn, {invoke: lookup}),
  implement(ISeqable, {seq}));
