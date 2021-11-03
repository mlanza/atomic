import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {right} from "./construct.js";
import {IFunctor, IOtherwise, IForkable, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  return right(f(self.value));
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  resolve(self.value);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Right"),
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));
