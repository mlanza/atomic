import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IBounds} from "../../protocols/ibounds.js";
import * as p from "./protocols.js";

function start(self){
  return p.start(self.period);
}

function end(self){
  return p.end(self.period);
}

export default does(
  implement(IBounds, {start, end}));
