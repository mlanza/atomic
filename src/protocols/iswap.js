import {protocol, satisfies} from "../types/protocol";
export const ISwap = protocol({
  swap: null
});
export const swap = ISwap.swap;
export const isSwap = satisfies(ISwap);
export default ISwap;