import {ITopic} from "./instance.js";
import {equiv} from "../iequiv/concrete.js";
import {detect} from "../../types/lazy-seq.js";
export const assert = ITopic.assert;
export const asserts = ITopic.asserts;
export const retract = ITopic.retract;

export function verify(self, key, value){
  return detect(equiv(?, value), asserts(self, key));
}
