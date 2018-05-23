import {protocol, satisfies} from "../types/protocol";
export const IObj = protocol({
  toObject: null
});
export const toObject = IObj.toObject;
export const isObj = satisfies(IObj);
export default IObj;