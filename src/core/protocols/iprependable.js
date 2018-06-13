import {protocol, satisfies} from "../types/protocol";
export const IPrependable = protocol({
  prepend: null
});
export const isPrependable = satisfies(IPrependable);