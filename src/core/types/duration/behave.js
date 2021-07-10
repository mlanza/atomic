import {implement} from "../protocol.js";
import {does, identity, partial} from "../../core.js";
import {mergeWith} from "../../protocols/imergable/instance.js";
import {Duration} from "../duration/construct.js";
import {IAddable, IKVReduce, IFunctor, IMergable, ICoercible, IMultipliable, IDivisible, IMap, IAssociative, ILookup} from "../../protocols.js";
import * as p from "./protocols.js";

function reducekv(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, key, lookup(self, key));
  }, init, keys(self));
}

const merge = partial(mergeWith, p.add);

function mult(self, n){
  return fmap(self, function(value){
    return value * n;
  });
}

function fmap(self, f){
  return new self.constructor(reducekv(self, function(memo, key, value){
    return p.assoc(memo, key, f(value));
  }, {}));
}

function keys(self){
  return p.keys(self.units);
}

function dissoc(self, key){
  return new self.constructor(p.dissoc(self.units, key));
}

function lookup(self, key){
  if (!p.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return p.get(self.units, key);
}

function contains(self, key){
  return p.contains(self.units, key);
}

function assoc(self, key, value){
  if (!p.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return new self.constructor(p.assoc(self.units, key, value));
}

function divide(a, b){
  return a.valueOf() / b.valueOf();
}

export default does(
  implement(IKVReduce, {reducekv}),
  implement(IAddable, {add: merge}),
  implement(IMergable, {merge}),
  implement(IFunctor, {fmap}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys, dissoc}),
  implement(IDivisible, {divide}),
  implement(IMultipliable, {mult}),
  implement(ICoercible, {toDuration: identity}));
