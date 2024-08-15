import {serialMap, SerialMap} from "./construct.js"
import {chain, does} from "../../core.js";
import {maybe} from  "../just/construct.js";
import {map} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import * as p from "../../protocols/concrete.js";
import {ILookup, IAssociative, ISeqable, IMap} from "../../protocols.js";

function lookup(self, key){
  return p.getIn(self.index, [self.serialize(key), 1]);
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

function seq(self){
  return p.seq(self.index) ? map(p.nth(?, 1), p.seq(self.index)) : null;
}

export default does(
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(IMap, {keys, dissoc}));
