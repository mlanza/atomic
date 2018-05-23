import {protocol, satisfies} from "../types/protocol";
export const IMapEntry = protocol({
  key: null,
  val: null
});
export const key = IMapEntry.key;
export const val = IMapEntry.val;
export const isMapEntry = satisfies(IMapEntry);
export default IMapEntry;