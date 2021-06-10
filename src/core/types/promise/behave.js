import {IFunctor, IForkable, IOtherwise} from "../../protocols.js";
import {identity, does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import Promise from "promise";

function fmap(self, resolve){
  return self.then(resolve);
}

function fork(self, reject, resolve){
  return self.then(resolve, reject);
}

function otherwise(self, other){
  return fmap(self, function(value){
    return value == null ? other : value;
  });
}

export const behaveAsPromise = does(
  implement(IOtherwise, {otherwise}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));