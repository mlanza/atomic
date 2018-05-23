import {protocol, satisfies} from "../types/protocol";
export const IReversible = protocol({
  reverse: null
});
export const reverse = IReversible.reverse;
export const isReversible = satisfies(IReversible);
export default IReversible;