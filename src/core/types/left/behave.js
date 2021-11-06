import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFunctor, IChainable, IForkable, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

const fmap = identity;
const chain = identity;

function fork(self, reject, resolve){
  reject(self.value);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Left"),
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IChainable, {chain}),
  implement(IFunctor, {fmap}));
