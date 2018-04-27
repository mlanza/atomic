import {protocol, satisfies} from "../protocol";
import {reduce} from "../protocols/ireduce";
import {partial, overload, slice, identity} from "../core";

export const IMap = protocol({
  _dissoc: null
});

const dissoc2 = IMap._dissoc;

function dissocN(obj){
  return reduce(dissoc2, obj, slice(arguments));
}

export const dissoc = overload(null, identity, dissoc2, dissocN);
export const isMap = partial(satisfies, IMap);
export default IMap;