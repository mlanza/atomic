import {protocol, satisfies} from "../types/protocol";
export const ISet = protocol({
  union: null,
  intersection: null,
  difference: null,
  superset: null,
  disj: null
});
export const isSet = satisfies(ISet);