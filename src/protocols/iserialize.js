import {protocol, satisfies} from "../types/protocol";
export const ISerialize = protocol({
  serialize: null
});
export const canSerialize = satisfies(ISerialize);