import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IBounds} from "../../protocols/ibounds.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function start(self){
  return p.start(self.period);
}

function end(self){
  return p.end(self.period);
}

export default does(
  naming("Benchmark"),
  implement(IBounds, {start, end}));
