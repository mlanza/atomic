import {protocol, satisfies} from "../types/protocol";
export const IInclusive = protocol({
  includes: null
});
export const isInclusive = satisfies(IInclusive);