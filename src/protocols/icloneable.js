import {protocol, satisfies} from "../protocol";
export const ICloneable = protocol({
  clone: null
});
export const clone = ICloneable.clone;
export const isCloneable = satisfies(ICloneable);
export default ICloneable;