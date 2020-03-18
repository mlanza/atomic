import {protocol} from "../../types/protocol";
import {IMultipliable} from "../imultipliable";
function inverse(self){
  return IMultipliable.mult(self, -1);
}
export const IInverse = protocol({
  inverse: inverse
});