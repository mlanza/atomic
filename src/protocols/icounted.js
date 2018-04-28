import {protocol, satisfies} from "../protocol";
export const ICounted = protocol({
  count: null
});
export const count = ICounted.count;
export const isCounted = satisfies(ICounted);
export default ICounted;