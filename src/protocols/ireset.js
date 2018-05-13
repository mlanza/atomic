import {protocol, satisfies} from "../protocol";
export const IReset = protocol({
  reset: null
});
export const reset = IReset.reset;
export const isReset = satisfies(IReset);
export default IReset;