import {protocol, satisfies} from "../protocol";
export const ISteppable = protocol({
  step: null,
  converse: null
});
export const step = ISteppable.step;
export const converse = ISteppable.converse;
export const isSteppable = satisfies(ISteppable);
export default ISteppable;