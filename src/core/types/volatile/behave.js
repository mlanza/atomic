import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IDeref} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function deref(self){
  return self.state;
}

export default does(
  keying("Volatile"),
  implement(IDeref, {deref}));
