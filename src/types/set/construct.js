import {Set} from "../../vendor/immutable";
export {Set} from "../../vendor/immutable";
import {toArray} from "../../protocols/iarr";

export function set(coll){
  return coll instanceof Set ? coll : new Set(toArray(coll));
}

export default Set;