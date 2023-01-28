import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IOtherwise, IForkable, IDeref} from "../../protocols.js";
import * as p from "../../protocols/concrete.js";
import {right, Right} from "./construct.js";
import monadic from "../../monadic.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {Left} from "../left/construct.js";

function flat(self){
  return self.value instanceof Right || self.value instanceof Left ? self.value : self;
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  resolve(self.value);
}

export default does(
  keying("Right"),
  monadic(right, flat),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}));
