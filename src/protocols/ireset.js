import {protocol, satisfies} from "../types/protocol";
export const IReset = protocol({
  reset: null
});
export const reset = IReset.reset;
export const isReset = satisfies(IReset);
export default IReset;