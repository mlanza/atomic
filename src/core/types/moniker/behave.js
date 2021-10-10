import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {IEquiv} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function equiv(self, other){
  return kin(self, other) && self.name === other.name;
}

export default does(
  naming("Moniker"),
  implement(IEquiv, {equiv}));
