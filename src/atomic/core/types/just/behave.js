import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IOtherwise, IFunctor, IFlatMappable, IDeref} from "../../protocols.js";
import {maybe, Just} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self){
  return self.value;
}

function flat(self){
  return self.value instanceof Just ? self.value : self;
}

function fmap(self, f){
  return maybe(f(self.value));
}

function deref(self){
  return self.value;
}

export default does(
  keying("Just"),
  implement(IFunctor, {fmap}),
  implement(IFlatMappable, {flat}),
  implement(IDeref, {deref}),
  implement(IOtherwise, {otherwise}));
