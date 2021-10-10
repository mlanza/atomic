import {IFunctor, IForkable} from "../../protocols.js";
import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {naming} from "../../protocols/inamable/concrete.js";

function fork(self, reject, resolve){
  return reject(self);
}

export default does(
  naming("Error"),
  implement(IForkable, {fork}));
