import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IFn} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function invoke(self, ...args){
  return self.f(...args);
}

export default does(
  keying("Router"),
  implement(IFn, {invoke}));
