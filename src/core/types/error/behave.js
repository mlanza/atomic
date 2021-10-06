import {IFunctor, IForkable} from "../../protocols.js";
import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function fork(self, reject, resolve){
  return reject(self);
}

export default does(
  naming(?, Symbol("Error")),
  implement(IForkable, {fork}));
