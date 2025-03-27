import {serialMap, SerialMap} from "./construct.js"
import {comp, chain, does} from "../../core.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {maybe} from  "../just/construct.js";
import {map} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import * as p from "../../protocols/concrete.js";
import {ITopic, ICollection, ICounted, ISeq, ILookup, IAssociative, ISeqable, IMap} from "../../protocols.js";
import {first, rest, reduceWith, reducekvWith, assert, retract} from "../../shared.js";

function lookup(self, key){
  return p.getIn(self.index, [self.serialize(key), 1]);
}

function conj(self, [key, value]){
  return assoc(self, key, value);
}

function assoc(self, key, value){
  return new SerialMap(p.assoc(self.index, self.serialize(key), [key, value]), self.serialize);
}

function dissoc(self, key){
  return new SerialMap(p.dissoc(self.index, self.serialize(key)), self.serialize);
}

function contains(self, key){
  return p.contains(self.index, self.serialize(key));
}

function keys(self){
  return map(p.first, p.seq(self.index));
}

function vals(self){
  return map(p.second, p.seq(self.index));
}

function seq(self){
  return p.seq(self.index) ? map(p.nth(?, 1), p.seq(self.index)) : null;
}

const count = comp(p.count, keys);
const reduce = reduceWith(seq);
const reducekv = reducekvWith(seq);

export default does(
  keying("SerialMap"),
  implement(ITopic, {assert, retract}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ICollection, {conj}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ISeq, {first, rest}),
  implement(IMap, {keys, vals, dissoc}));
