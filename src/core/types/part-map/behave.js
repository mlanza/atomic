import {partMap, PartMap} from "./construct.js"
import {keying} from "../../protocols/imapentry/concrete.js";
import {comp, chain, does} from "../../core.js";
import {maybe} from  "../just/construct.js";
import {concatenated, map, mapa} from "../lazy-seq/concrete.js";
import {implement} from "../../types/protocol/concrete.js";
import * as p from "../../protocols/concrete.js";
import {ILookup, IAssociative, ISeqable, IMap} from "../../protocols.js";
import behave from "../object/behave.js";

function lookup(self, key){
  const part = self.partition(key);
  return p.getIn(self.parts, [part, key]);
}

function assoc(self, key, value){
  const part = self.partition(key);
  return new PartMap(self.partition, self.store, chain(
    p.contains(self.parts, part) ? self.parts : p.assoc(self.parts, part, self.store(key)),
    p.assocIn(?, [part, key], value)));
}

function dissoc(self, key){
  const part = self.partition(key);
  return new PartMap(self.partition, self.store, p.contains(self.parts, part) ? p.dissocIn(self.parts, [part, key]) : self.parts);
}

function contains(self, key){
  const part = self.partition(key);
  return maybe(self.parts, p.get(?, part), p.contains(?, key));
}

function keys(self){
  return concatenated(mapa(function([key, part]){
    return p.keys(part);
  }, self.parts));
}

function seq(self){
  return p.seq(map(function(key){
    return [key, p.get(self, key)];
  }, keys(self)));
}

export default does(
  behave,
  keying("PartMap"),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(IMap, {keys, dissoc}));
