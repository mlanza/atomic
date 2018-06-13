import {protocol, satisfies} from "../types/protocol";
export const IFind = protocol({
  find: null
});
export const isFindable = satisfies(IFind);