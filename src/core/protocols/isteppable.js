import {protocol, satisfies} from "../types/protocol";
export const ISteppable = protocol({
  step: null
});
export const isSteppable = satisfies(ISteppable);