import {is} from "../../protocols/imapentry/concrete.js";
import {coerce} from "../../coerce.js";

export function isArray(self){
  return is(self, Array);
}

export const toArray = coerce(?, Array);
