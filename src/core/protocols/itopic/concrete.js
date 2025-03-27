import {ITopic} from "./instance.js";
import {equiv} from "../iequiv/concrete.js";
import {detect} from "../../types/lazy-seq.js";
export const assert = ITopic.assert;
export const retract = ITopic.retract;

export function verify(self, key, value){
  return detect(function([_, v]){
    return equiv(value, v);
  }, assert(self, key));
}
