import {does} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols.js";
import * as P from "../../protocols/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function equiv(self, other){
  return P.equiv(self.id, other.id) && P.equiv(self.context, other.context);
}

function hash(self){
  return P.hash(self.id + "/" + (self.context || ""));
}

export default does(
  implement(p.IEquiv, {equiv}),
  implement(p.IHashable, {hash}),
  keying("UID"));
