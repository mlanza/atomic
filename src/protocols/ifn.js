import {protocol, satisfies} from "../types/protocol";
export const IFn = protocol({
  invoke: null
});
export const isFn = satisfies(IFn);