import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IBounded} from "../../protocols/ibounded.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function start(self){
  return p.start(self.period);
}

function end(self){
  return p.end(self.period);
}

export default does(
  keying("Benchmark"),
  implement(IBounded, {start, end}));
