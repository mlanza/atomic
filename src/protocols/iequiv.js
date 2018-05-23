import {protocol, satisfies} from "../types/protocol";
export const IEquiv = protocol({
  equiv: function(x, y){
    return x === y;
  }
});
export const equiv = IEquiv.equiv;
export const isEquiv = satisfies(IEquiv);
export default IEquiv;