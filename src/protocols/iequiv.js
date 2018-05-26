import {protocol, satisfies} from "../types/protocol";
function _equiv(x, y){
  return x === y;
}
export const IEquiv = protocol({
  equiv: _equiv
});
export const equiv = IEquiv.equiv;
export const isEquiv = satisfies(IEquiv);
export default IEquiv;