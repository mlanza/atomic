import {protocol, satisfies} from "../types/protocol";
export const IInclusive = protocol({
  includes: null
});
export const includes = IInclusive.includes;
export const isInclusive = satisfies(IInclusive);
export default IInclusive;