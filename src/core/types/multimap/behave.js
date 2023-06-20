import {doto, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {ITopic, IReducible, IKVReducible, ISeqable} from "../../protocols.js";
import {map, detect, concatenated} from "../lazy-seq.js";
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
  function confirm(self, key, value){
    return detect(p.equiv(?, value), p.get(self, key));
  }

  function assert(self, key, value){
    const copy = p.clone(self),
          values = p.get(self, key, empty);
    copy[key] = p.conj(values, value);
    return copy;
  }

  function retract(self, key, value){
    const copy = p.clone(self),
          values = p.get(self, key, empty);
    copy[key] = p.omit(values, value);
    return copy;
  }

  const construct = record(Type);

  doto(
    Type,
    implement(ITopic, {assert, retract, confirm}),
    implement(IReducible, {reduce}),
    implement(IKVReducible, {reducekv}),
    implement(ISeqable, {seq}));

  return construct;
}
