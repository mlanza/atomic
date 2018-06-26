import Immutable from "immutable";

export const Map = Immutable.Map;

export function map(obj){
  return obj instanceof Map ? obj : new Map(obj);
}

export default Map;