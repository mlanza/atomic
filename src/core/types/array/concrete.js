import {is} from "../../protocols/imapentry/concrete.js";
import {coerce} from "../../protocols/icoercible/concrete.js";

export function isArray(self){
  return is(self, Array);
}

export const toArray = coerce(?, Array);
