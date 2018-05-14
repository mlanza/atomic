import {protocol, satisfies} from "../protocol";
export const IFind = protocol({
  find: null
});
export const find = IFind.find;
export const isFindable = satisfies(IFind);
export default IFind;