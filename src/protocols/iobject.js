import {protocol, satisfies} from "../types/protocol";
export const IObject = protocol({
  toObject: null
});
export const canBecomeObject = satisfies(IObject);