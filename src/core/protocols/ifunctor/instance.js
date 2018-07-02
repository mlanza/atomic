import {protocol} from "../../types/protocol";
function fmap(self, f){
  return f(self);
}
export const IFunctor = protocol({
  fmap: fmap
});
export default IFunctor;