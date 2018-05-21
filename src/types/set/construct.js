import {Set} from "../../vendor/immutable";

export function set(coll){
  return new Set(coll || []);
}

export default Set;