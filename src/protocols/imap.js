import {protocol, satisfies} from "../types/protocol";
import {reduce} from "../protocols/ireduce";
import {overload, identity} from "../core";
export const IMap = protocol({
  dissoc: null,
  keys: null,
  vals: null
});
export const dissoc = IMap.dissoc;
export const keys = IMap.keys;
export const vals = IMap.vals;
export const isMap = satisfies(IMap);
export default IMap;