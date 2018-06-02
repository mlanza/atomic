import {protocol, satisfies} from "../types/protocol";
import {IDeref} from "../protocols/ideref";
function converse(self){
  return new self.constructor(IDeref.deref(self) * -1);
}
export const ISteppable = protocol({
  step: null,
  converse: converse
});
export const isSteppable = satisfies(ISteppable);