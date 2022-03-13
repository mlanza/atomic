import {implement} from "../protocol.js";
import {constantly, identity as fmap, identity as flatMap, does} from "../../core.js";
import {IFunctor, IFlatMappable, IOtherwise, IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self, other){
  return other;
}

const deref = constantly(null);

export default does(
  keying("Nothing"),
  implement(IDeref, {deref}),
  implement(IOtherwise, {otherwise}),
  implement(IFlatMappable, {flatMap}),
  implement(IFunctor, {fmap}));
