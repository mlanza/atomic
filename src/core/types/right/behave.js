import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {right} from "./construct.js";
import {IFunctor, IOtherwise, IForkable, IDeref} from "../../protocols.js";

function fmap(self, f){
  return right(f(self.value));
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  return resolve(self.value);
}

function deref(self){
  return self.value;
}

export const behaveAsRight = does(
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));