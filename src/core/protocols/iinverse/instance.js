import {protocol} from "../../types/protocol.js";
import {IMultipliable} from "../imultipliable.js";
function inverse(self){
  return IMultipliable.mult(self, -1);
}
export const IInverse = protocol({
  inverse: inverse
});