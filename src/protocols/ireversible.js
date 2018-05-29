import {protocol, satisfies} from "../types/protocol";
export const IReversible = protocol({
  reverse: null
});
export const isReversible = satisfies(IReversible);