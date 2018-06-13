import {protocol, satisfies} from "../types/protocol";
function deref(self){
  return self == null ? null : self.valueOf();
}
export const IDeref = protocol({
  deref: deref
});
export const isDeref = satisfies(IDeref);