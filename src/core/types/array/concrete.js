import {is} from "../../protocols/inamable/concrete.js";

export function isArray(self){
  return is(self, Array);
}
