import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {kin} from "../../protocols/iequiv/concrete.js";
import {IEquiv, IHashable} from "../../protocols.js";
import * as h from "../../protocols/ihashable/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function equiv(self, other){
  return self === other;
}

function hash(self){
  return h.hash(self.toString());
}

export default does(
  keying("Moniker"),
  implement(IHashable, {hash}),
  implement(IEquiv, {equiv}));
