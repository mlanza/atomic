import {IFunctor, IForkable, IChainable} from "../../protocols.js";
import {identity, does, overload, noop} from "../../core.js";
import {implement} from "../protocol.js";
import {task} from "./construct.js";
import {comp} from "../function/concrete.js";

function fmap(self, f){
  return task(function(reject, resolve){
    self.fork(reject, comp(resolve, f));
  });
}

function chain(self, f){
  return task(function(reject, resolve){
    self.fork(reject, function(value){
      IForkable.fork(f(value), reject, resolve);
    });
  });
}

function fork(self, reject, resolve){
  self.fork(reject, resolve);
}

export const behaveAsTask = does(
  implement(IChainable, {chain}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));