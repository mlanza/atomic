import {doto, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ICoercible, IReducible, IKVReducible, ISeqable, ICollection, ILookup, IMap, IAssociative} from "../../protocols.js";
import {map, concatenated} from "../lazy-seq.js";
import {emptyList} from "../empty-list/construct.js";
import record from "../record/behave.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function seq(self){
  return concatenated(map(function(key){
    return map(function(value){
      return [key, value];
    }, p.seq(p.get(self, key)) || emptyList());
  }, p.keys(self)));
}

function assoc(self, key, value){
  const copy = p.clone(self);
  copy[key] = p.conj(p.get(self, key), value);
  return copy;
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

export default function(Type, empty = []){ //empty set?
  function lookup(self, key){
    return self[key] || empty;
  }
  doto(
    Type,
    record,
    implement(IReducible, {reduce}),
    implement(IKVReducible, {reducekv}),
    implement(ISeqable, {seq}),
    implement(ILookup, {lookup}),
    implement(IAssociative, {assoc}));
}
