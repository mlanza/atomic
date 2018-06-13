import {protocol, satisfies} from "../types/protocol";
function equiv(x, y){
  return x === y;
}
export const IEquiv = protocol({
  equiv: equiv
});
export const isEquiv = satisfies(IEquiv);