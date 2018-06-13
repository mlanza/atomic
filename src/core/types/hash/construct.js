import {Map} from "../../../vendor/immutable";
export const Hash = Map;

export function hash(obj){
  return obj instanceof Hash ? obj : new Hash(obj);
}

export default Hash;