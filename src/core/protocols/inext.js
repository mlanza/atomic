import {protocol, satisfies} from "../types/protocol";
export const INext = protocol({
  next: null
});
export const isNext = satisfies(INext);