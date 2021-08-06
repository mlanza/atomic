import {Reduced} from "./construct.js";
import {is} from "../../protocols/inamable/concrete.js";

export function isReduced(self){
  return is(self, Reduced);
}

export function unreduced(self){
  return isReduced(self) ? self.valueOf() : self;
}
