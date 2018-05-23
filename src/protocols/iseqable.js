import {protocol, satisfies} from "../types/protocol";
export const ISeqable = protocol({
  seq: null
});
export const seq = ISeqable.seq;
export const isSeqable = satisfies(ISeqable);
export default ISeqable;