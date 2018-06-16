import {overload} from "../core";
import {protocol, satisfies} from "../types/protocol";
function fmap(self, f){
  return f(self);
}
export const IFunctor = protocol({
  fmap: fmap
});
export const isFunctor = satisfies(IFunctor);