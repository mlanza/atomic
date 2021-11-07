import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IOtherwise} from "../../protocols.js";
import {maybe} from "./construct.js";
import monadic from "../../monadic.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self){
  return self.value;
}

export default does(
  keying("Just"),
  monadic(maybe),
  implement(IOtherwise, {otherwise}));
