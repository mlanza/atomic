import {protocol, satisfies} from "../types/protocol";
export const IMap = protocol({
  dissoc: null,
  keys: null,
  vals: null
});
export const isMap = satisfies(IMap);