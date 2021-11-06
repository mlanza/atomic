import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {fluent} from "./construct.js";
import {IFunctor, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  const value = f(self.value);
  return fluent(value == undefined ? self.value : value);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Fluent"),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}));
