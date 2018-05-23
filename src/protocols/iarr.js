import {protocol, satisfies} from "../types/protocol";
export const IArr = protocol({
  toArray: null
});
export const toArray = IArr.toArray;
export const isArr = satisfies(IArr);
export default IArr;