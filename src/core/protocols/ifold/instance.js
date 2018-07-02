import {protocol} from "../../types/protocol";
function fold(self, error, okay){
  return okay(self);
}
export const IFold = protocol({
  fold: fold
});
export default IFold;