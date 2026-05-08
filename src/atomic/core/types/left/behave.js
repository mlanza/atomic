import {implement, satisfies} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IFlatMappable, IForkable, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {left} from "./construct.js";

const fmap = identity;

function flat(self){
  return self.value instanceof Right || self.value instanceof Left ? self.value : self;
}

function fork(self, reject, resolve){
  reject(self.value);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Left"),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IFlatMappable, {flat}),
  implement(IForkable, {fork}));
