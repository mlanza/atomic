import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IEquiv} from "../../protocols.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {naming} from "../../protocols/inamable/concrete.js";

function equiv(self, other){
  return kin(self, other) && self.id === other.id;
}

export default does(
  naming("GUID"),
  implement(IEquiv, {equiv}));
