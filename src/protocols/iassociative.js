import {protocol, satisfies} from "../types/protocol";
export const IAssociative = protocol({
  assoc: null,
  contains: null
});
export const assoc = IAssociative.assoc;
export const contains = IAssociative.contains;
export const isAssociative = satisfies(IAssociative);
export default IAssociative;