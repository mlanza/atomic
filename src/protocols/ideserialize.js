import {protocol, satisfies} from "../types/protocol";
export const IDeserialize = protocol({
  deserialize: null
});
export const canDeserialize = satisfies(IDeserialize);