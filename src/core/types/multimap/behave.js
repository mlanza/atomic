import {does, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ICoercible, IReducible, IKVReducible, ICounted, ISeqable, ICollection, ILookup, IMap, IAssociative} from "../../protocols.js";
import {map} from "../lazy-seq.js";
import {emptyList} from "../empty-list/construct.js";
import {concatenated} from "../concatenated/construct.js";
import record from "../record/behave.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function keys(self){
  return Object.keys(self.attrs);
}

function count(self){
  return p.count(seq(self));
}

function seq(self){
  return concatenated(map(function(key){
    return map(function(value){
      return [key, value];
    }, p.seq(p.get(self, key)) || emptyList());
  }, keys(self)));
}

function first(self){
  return p.first(seq(self));
}

function rest(self){
  return p.rest(seq(self));
}

function lookup(self, key){
  return p.get(self.attrs, key);
}

function assoc(self, key, value){
  const values = lookup(self, key) || self.empty(key);
  return new self.constructor(p.assoc(self.attrs, key, p.conj(values, value)), self.empty);
}

function contains(self, key){
  return p.contains(self.attrs, key);
}

function reduce(self, f, init){
  return p.reduce(function(memo, pair){
    return f(memo, pair);
  }, init, seq(self));
}

function reducekv(self, f, init){
  return reduce(self, function(memo, [key, value]){
    return f(memo, key, value);
  }, init);
}

export default does(
  record,
  keying("Multimap"),
  implement(IMap, {keys}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeq, {first, rest}));
