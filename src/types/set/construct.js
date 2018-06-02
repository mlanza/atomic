import {Set} from "../../vendor/immutable";
export {Set} from "../../vendor/immutable";
import {IArray} from "../../protocols/iarray";

export function set(coll){
  return coll instanceof Set ? coll : new Set(IArray.toArray(coll));
}

export default Set;