import {protocol, satisfies} from "../types/protocol";
export const IPrependable = protocol({
  prepend: null
});
export const prepend = IPrependable.prepend;
export const isPrependable = satisfies(IPrependable);
export default IPrependable;