import {overload} from "../../core.js";
import {IReduce} from "../../protocols/ireduce.js";
import {isReduced} from "./construct.js";

export function unreduced(self){
  return isReduced(self) ? self.valueOf() : self;
}