import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IFn = protocol({
  invoke: null
});

export const invoke = IFn.invoke;
export const isFn = partial(satisfies, IFn);
export default IFn;