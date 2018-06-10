import {protocol, satisfies} from "../types/protocol";
export const IDecode = protocol({
  decode: null
});
export const canDecode = satisfies(IDecode);