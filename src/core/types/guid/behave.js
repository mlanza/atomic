import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {IEquiv, IHashable} from "../../protocols.js";
import * as h from "../../protocols/ihashable/concrete.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function equiv(self, other){
  return kin(self, other) && self.id === other.id;
}

function hash(self){
  return h.hash(self.id);
}

export default does(
  keying("GUID"),
  implement(IHashable, {hash}),
  implement(IEquiv, {equiv}));
