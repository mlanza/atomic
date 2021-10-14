import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IEquiv, IHash} from "../../protocols.js";
import * as h from "../../protocols/ihash/concrete.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {naming} from "../../protocols/inamable/concrete.js";

function equiv(self, other){
  return kin(self, other) && self.id === other.id;
}

function hash(self){
  return h.hash(self.id);
}

export default does(
  naming("GUID"),
  implement(IHash, {hash}),
  implement(IEquiv, {equiv}));
