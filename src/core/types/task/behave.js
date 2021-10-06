import {IFunctor, IForkable, IChainable} from "../../protocols.js";
import {identity, does, overload, noop, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {task} from "./construct.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function fmap(self, f){
  return task(function(reject, resolve){
    self.fork(reject, comp(resolve, f));
  });
}

function chain(self, f){
  return task(function(reject, resolve){
    self.fork(reject, function(value){
      p.fork(f(value), reject, resolve);
    });
  });
}

function fork(self, reject, resolve){
  self.fork(reject, resolve);
}

export default does(
  naming(?, Symbol("Task")),
  implement(IChainable, {chain}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
