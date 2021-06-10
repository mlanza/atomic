import {IFunctor, IForkable} from "../../protocols.js";
import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";

function fork(self, reject, resolve){
  return reject(self);
}

export const behaveAsError = does(
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap: identity}));