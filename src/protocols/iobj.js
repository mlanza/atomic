import {protocol, satisfies} from "../protocol";
export const IObj = protocol({
  toObject: null
});
export const toObject = IObj.toObject;
export const isObj = satisfies(IObj);
export default IObj;