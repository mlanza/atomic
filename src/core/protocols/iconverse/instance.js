import {protocol} from "../../types/protocol";
import {IDeref} from "../ideref";
function converse(self){
  return new self.constructor(IDeref.deref(self) * -1);
}
export const IConverse = protocol({
  converse: converse
});
export default IConverse;