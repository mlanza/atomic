import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IBounds} from "../../protocols.js";

function start(self){
  return IBounds.start(self.period);
}

function end(self){
  return IBounds.start(self.period);
}

export const behaveAsBenchmark = does(
  implement(IBounds, {start, end}));