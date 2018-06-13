import {protocol, satisfies} from "../types/protocol";
export const IIndexed = protocol({
  nth: null
});
export const isIndexed = satisfies(IIndexed);