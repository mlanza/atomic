import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {Verified} from "./construct.js";
import {IFunctor, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  const value = f(self.value);
  return new Verified(self.pred(value) ? value : self.value, self.pred);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Verified"),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}));
