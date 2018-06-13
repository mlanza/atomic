import {protocol, satisfies} from "../types/protocol";
export const IReset = protocol({
  reset: null
});
export const isResettable = satisfies(IReset);