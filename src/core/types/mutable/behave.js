import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IDeref, ISwap, IReset, IFunctor} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function deref(self){
  return self.obj;
}

function swap(self, f){
  return self.obj = f(self.obj);
}

function reset(self, obj){
  return self.obj = obj;
}

function fmap(self, f){
  swap(self, f);
  return self;
}

export default does(
  naming("Mutable"),
  implement(IFunctor, {fmap}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(IDeref, {deref}));
