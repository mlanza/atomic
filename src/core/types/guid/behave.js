import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IEquiv} from "../../protocols.js";
import Symbol from "symbol";

function equiv(self, other){
  return other && other.constructor === self.constructor && self.id === other.id;
}

export default does(
  implement(IEquiv, {equiv}));
