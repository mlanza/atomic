import {implement} from "../protocol.js";
import {constantly, identity as fmap, does} from "../../core.js";
import {IFunctor, IOtherwise, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self, other){
  return other;
}

const deref = constantly(null);

export default does(
  keying("Just"),
  implement(IDeref, {deref}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));
