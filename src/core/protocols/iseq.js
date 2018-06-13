import {protocol, satisfies} from "../types/protocol";
export const ISeq = protocol({
  first: null,
  rest: null
});
export const isSeq = satisfies(ISeq);