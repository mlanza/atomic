import {protocol} from "../../types/protocol";
function equiv(x, y){
  return x === y;
}
export const IEquiv = protocol({
  equiv: equiv
});