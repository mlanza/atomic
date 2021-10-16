import {IFunctor, IForkable} from "../../protocols.js";
import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fork(self, reject, resolve){
  return reject(self);
}

export default does(
  keying("Error"),
  implement(IForkable, {fork}));
