import {protocol, satisfies} from "../types/protocol";
export const IMapEntry = protocol({
  key: null,
  val: null
});
export const isMapEntry = satisfies(IMapEntry);