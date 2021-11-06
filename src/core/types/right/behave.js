import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IChainable, IOtherwise, IForkable, IDeref} from "../../protocols.js";
import * as p from "../../protocols/concrete.js";
import {right, isEither} from "./construct.js";
import monadic from "../../monadic.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  resolve(self.value);
}

export default does(
  keying("Right"),
  monadic(right, isEither),
  implement(IForkable, {fork}),
  implement(IOtherwise, {otherwise}));
