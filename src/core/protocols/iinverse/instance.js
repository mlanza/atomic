import {protocol} from "../../types/protocol";
import {IDeref} from "../ideref";
function inverse(self){
  return new self.constructor(IDeref.deref(self) * -1);
}
export const IInverse = protocol({
  inverse: inverse
});
export default IInverse;