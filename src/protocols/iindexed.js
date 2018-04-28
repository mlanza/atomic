import {protocol, satisfies} from "../protocol";
export const IIndexed = protocol({
  nth: null
});
export const nth = IIndexed.nth;
export const isIndexed = satisfies(IIndexed);
export default IIndexed;