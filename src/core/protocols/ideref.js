import {protocol, satisfies} from "../types/protocol";
export const IDeref = protocol({
  deref: null
});
export const isDeref = satisfies(IDeref);