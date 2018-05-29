import {protocol, satisfies} from "../types/protocol";
export const IAssociative = protocol({
  assoc: null,
  contains: null
});
export const isAssociative = satisfies(IAssociative);