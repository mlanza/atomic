import {protocol, satisfies} from "../protocol";
export const ISwap = protocol({
  swap: null
});
export const swap = ISwap.swap;
export const isSwap = satisfies(ISwap);
export default ISwap;