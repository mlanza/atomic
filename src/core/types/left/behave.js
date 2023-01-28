import {implement, satisfies} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IForkable, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {left} from "./construct.js";
import monadic from "../../monadic.js";

const fmap = identity;
function flat(self){
  return self;
}
function fork(self, reject, resolve){
  reject(self.value);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Left"),
  monadic(left, flat),
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
