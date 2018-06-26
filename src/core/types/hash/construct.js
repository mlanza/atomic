import Immutable from "immutable";
export const Hash = Immutable.Map;

export function hash(obj){
  return obj instanceof Hash ? obj : new Hash(obj);
}

export default Hash;