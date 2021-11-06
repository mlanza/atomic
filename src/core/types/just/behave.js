import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {just} from "./construct.js";
import {IFunctor, IOtherwise, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  return just(f(self.value));
}

function deref(self){
  return self.value;
}

const otherwise = deref;

export default does(
  keying("Just"),
  implement(IDeref, {deref}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));
