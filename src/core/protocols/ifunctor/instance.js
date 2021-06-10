import {protocol} from "../../types/protocol.js";
function fmap(self, f){
  return f(self);
}
export const IFunctor = protocol({
  fmap: fmap
});