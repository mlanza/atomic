import {is} from "../../protocols/imapentry/concrete.js";
import {satisfies} from "../protocol.js";
import {ICoercible} from "../../protocols/icoercible/instance.js";

export function isArray(self){
  return is(self, Array);
}

export function toArray(self){
  const f = satisfies(ICoercible, "coerce", self);
  return f ? f(self, Array) : Array.from(self);
}
