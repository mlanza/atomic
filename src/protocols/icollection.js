import {protocol, satisfies} from "../types/protocol";
export const ICollection = protocol({
  conj: null
});
export const isCollection = satisfies(ICollection);