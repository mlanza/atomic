import {protocol, satisfies} from "../types/protocol";
export const IArr = protocol({
  toArray: null
});
export const isArr = satisfies(IArr);