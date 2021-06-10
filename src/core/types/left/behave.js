import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IForkable, IDeref} from "../../protocols.js";

const fmap = identity;

function fork(self, reject, resolve){
  return reject(self.value);
}

function deref(self){
  return self.value;
}

export const behaveAsLeft = does(
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));