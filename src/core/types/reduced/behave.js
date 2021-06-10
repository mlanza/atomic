import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IDeref} from "../../protocols.js";

function deref(self){
  return self.valueOf();
}

export const behaveAsReduced = does(
  implement(IDeref, {deref}));