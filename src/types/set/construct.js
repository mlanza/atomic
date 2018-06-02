import {Set} from "../../vendor/immutable";
export {Set} from "../../vendor/immutable";
import {ISequential} from "../../protocols/isequential";

export function set(coll){
  return coll instanceof Set ? coll : new Set(ISequential.toArray(coll));
}

export default Set;