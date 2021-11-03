import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {maybe} from "./construct.js";
import {IFunctor, IOtherwise, IForkable, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  return self.value == null ? self : maybe(f(self.value));
}

function otherwise(self, other){
  return self.value == null ? other : self.value;
}

function fork(self, reject, resolve){
  resolve(self.value == null ? null : self.value);
}

function deref(self){
  return self.value == null ? null : self.value;
}

export default does(
  keying("Maybe"),
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));
