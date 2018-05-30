import {protocol, satisfies} from "../types/protocol";
export const ILookup = protocol({
  lookup: null
});
export const isLookup = satisfies(ILookup);