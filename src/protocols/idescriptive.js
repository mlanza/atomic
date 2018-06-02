import {protocol, satisfies} from "../types/protocol";
export const IDescriptive = protocol({
  toObject: null
});
export const isDescriptive = satisfies(IDescriptive);