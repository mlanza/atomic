import {protocol, satisfies} from "../types/protocol";
export const ISeqable = protocol({
  seq: null
});
export const isSeqable = satisfies(ISeqable);