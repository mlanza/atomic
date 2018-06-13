import {overload} from "../../core";
import {IReduce} from "../../protocols/ireduce";
import {isReduced} from "./construct";

export function unreduced(self){
  return isReduced(self) ? self.valueOf() : self;
}