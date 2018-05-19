import {protocol, satisfies} from "../protocol";
import {reduce} from "../protocols/ireduce";
import {overload, identity} from "../core";
export const IMap = protocol({
  dissoc: null
});
export const dissoc = IMap.dissoc;
export const isMap = satisfies(IMap);
export default IMap;