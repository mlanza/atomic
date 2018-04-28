import {protocol, satisfies} from "../protocol";
export const IOffset = protocol({
  inc: null,
  dec: null,
  increment: null,
  decrement: null
});
export const inc = IOffset.inc;
export const dec = IOffset.dec;
export const increment = IOffset.increment;
export const decrement = IOffset.decrement;
export const isOffset = satisfies(IOffset);
export default IOffset;