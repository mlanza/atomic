import {protocol, satisfies} from "../protocol";
export const ISet = protocol({
  union: null,
  intersection: null,
  difference: null,
  superset: null,
  disj: null
});
export const union = ISet.union;
export const intersection = ISet.intersection;
export const difference = ISet.difference;
export const superset = ISet.superset;
export const disj = ISet.disj;
export const isSet = satisfies(ISet);
export default ISet;