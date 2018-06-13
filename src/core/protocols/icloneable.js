import {protocol, satisfies} from "../types/protocol";
export const ICloneable = protocol({
  clone: null
});
export const isCloneable = satisfies(ICloneable);