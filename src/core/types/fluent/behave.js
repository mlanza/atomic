import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {fluent} from "./construct.js";
import {IFunctor, IDeref} from "../../protocols.js";

function fmap(self, f){
  return fluent(f(self.value) || self.value);
}

function deref(self){
  return self.value;
}

export default does(
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}));