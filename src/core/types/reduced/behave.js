import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function deref(self){
  return self.valueOf();
}

export default does(
  keying("Reduced"),
  implement(IDeref, {deref}));
