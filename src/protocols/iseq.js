import {protocol, satisfies} from "../types/protocol";
export const ISeq = protocol({
  first: null,
  rest: null
});
export const first = ISeq.first;
export const rest  = ISeq.rest;
export const isSeq = satisfies(ISeq);
export default ISeq;