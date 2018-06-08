import {protocol, satisfies} from "../types/protocol";
export const IArray = protocol({
  toArray: null
});
export const canBecomeArray = satisfies(IArray);