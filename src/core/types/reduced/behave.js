import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IDeref} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function deref(self){
  return self.valueOf();
}

export default does(
  naming(?, Symbol("Reduced")),
  implement(IDeref, {deref}));
