import {protocol, satisfies} from "../protocol";
import {reduce} from "../protocols/ireduce";
import {overload, identity} from "../core";

export const IMap = protocol({
  _dissoc: null
});

const dissoc2 = IMap._dissoc;

function dissocN(obj, ...keys){
  return reduce(dissoc2, obj, keys);
}

export const dissoc = overload(null, identity, dissoc2, dissocN);
export const isMap = satisfies(IMap);
export default IMap;