import {protocol, satisfies} from "../types/protocol";
export const IMatch = protocol({
  matches: null
});
export const canMatch = satisfies(IMatch);