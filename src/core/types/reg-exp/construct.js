import {is} from "../../protocols/imapentry/concrete.js";

export function isRegExp(self){
  return is(self, RegExp);
}
