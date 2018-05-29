import {Set} from "../../vendor/immutable";
export {Set} from "../../vendor/immutable";
import {IArr} from "../../protocols/iarr";

export function set(coll){
  return coll instanceof Set ? coll : new Set(IArr.toArray(coll));
}

export default Set;