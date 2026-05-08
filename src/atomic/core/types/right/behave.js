import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IFlatMappable, IOtherwise, IForkable, IDeref} from "../../protocols.js";
import * as p from "../../protocols/concrete.js";
import {result, right, Right} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {left, Left} from "../left/construct.js";

function flat(self){
  return self.value instanceof Right || self.value instanceof Left ? self.value : self;
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  resolve(self.value);
}

function fmap(self, f){
  try {
    return result(f(self.value));
  } catch (error) {
    return left(error);
  }
}

function deref(self){
  return self.value;
}

export default does(
  keying("Right"),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IFlatMappable, {flat}),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}));
