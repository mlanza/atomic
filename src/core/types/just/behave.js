import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IOtherwise} from "../../protocols.js";
import {maybe, Just} from "./construct.js";
import monadic from "../../monadic.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function otherwise(self){
  return self.value;
}

function flat(self){
  return self.value instanceof Just ? self.value : self;
}

export default does(
  keying("Just"),
  monadic(maybe, flat),
  implement(IOtherwise, {otherwise}));
