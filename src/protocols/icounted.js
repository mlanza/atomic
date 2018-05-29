import {protocol, satisfies} from "../types/protocol";
export const ICounted = protocol({
  count: null
});
export const isCounted = satisfies(ICounted);