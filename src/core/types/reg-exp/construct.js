import {is} from "../../protocols/inamable/concrete.js";

export function isRegExp(self){
  return is(self, RegExp);
}
