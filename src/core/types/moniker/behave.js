import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IEquiv} from "../../protocols.js";
//import {naming} from "../../protocols/inamable/concrete.js";

function equiv(self, other){
  return self === other;
}

export default does(
  //naming("Moniker"),
  implement(IEquiv, {equiv}));
