import {protocol, satisfies} from "../types/protocol";
export const IObj = protocol({
  toObject: null
});
export const isObj = satisfies(IObj);