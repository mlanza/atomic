import {protocol, satisfies} from "../types/protocol";
export const IFn = protocol({
  invoke: null
});
export const invoke = IFn.invoke;
export const isFn = satisfies(IFn);
export default IFn;
