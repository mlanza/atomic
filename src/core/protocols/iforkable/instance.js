import {protocol} from "../../types/protocol";
function fork(self, reject, resolve){
  return resolve(self);
}
export const IForkable = protocol({
  fork: fork
});