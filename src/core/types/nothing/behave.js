import {implement} from "../protocol.js";
import {constantly, identity as fmap, identity as chain, does} from "../../core.js";
import {IFunctor, IChainable, IOtherwise, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self, other){
  return other;
}

const deref = constantly(null);

export default does(
  keying("Nothing"),
  implement(IDeref, {deref}),
  implement(IOtherwise, {otherwise}),
  implement(IChainable, {chain}),
  implement(IFunctor, {fmap}));
