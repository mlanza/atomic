import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {fluent} from "./construct.js";
import {IFunctor, IDeref} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function fmap(self, f){
  return fluent(f(self.value) || self.value);
}

function deref(self){
  return self.value;
}

export default does(
  naming(?, Symbol("Fluent")),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}));
