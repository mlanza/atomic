import {protocol, satisfies} from "../types/protocol";
export const IEncode = protocol({
  encode: null
});
export const canEncode = satisfies(IEncode);