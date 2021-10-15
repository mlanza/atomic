import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {IEquiv, IHash} from "../../protocols.js";
import * as h from "../../protocols/ihash/concrete.js";
import {naming} from "../../protocols/inamable/concrete.js";

function equiv(self, other){
  return kin(self, other) && self.name === other.name;
}

function hash(self){
  return h.hash(self.toString());
}

export default does(
  naming("Moniker"),
  implement(IHash, {hash}),
  implement(IEquiv, {equiv}));
