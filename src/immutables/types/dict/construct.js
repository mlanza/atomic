import Immutable from "immutable";

export const Dict = Immutable.Map;

export function dict(obj){
  return obj instanceof Dict ? obj : new Dict(obj);
}

export default Dict;