import {IFunctor, IForkable, IFlatMappable} from "../../protocols.js";
import {identity, does, overload, noop, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {task} from "./construct.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  return task(function(reject, resolve){
    self.fork(reject, comp(resolve, f));
  });
}

function flatMap(self, f){
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
  keying("Task"),
  implement(IFlatMappable, {flatMap}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
