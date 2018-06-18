import {protocol, satisfies} from "../types/protocol";
export const IValue = protocol({
  value: null
});
export const hasValue = satisfies(IValue);