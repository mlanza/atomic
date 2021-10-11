import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IDeref, ISwap, IReset} from "../../protocols.js";
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

export default does(
  naming("Mutable"),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(IDeref, {deref}));
