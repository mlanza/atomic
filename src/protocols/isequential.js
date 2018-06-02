import {protocol, satisfies} from "../types/protocol";
export const ISequential = protocol({
  toArray: null
});
export const isSequential = satisfies(ISequential);