import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IDeref} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function deref(self){
  return self.obj;
}

export default does(
  naming("Mutable"),
  implement(IDeref, {deref}));
