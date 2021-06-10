import {protocol} from "../../types/protocol.js";
function fork(self, reject, resolve){
  return resolve(self);
}
export const IForkable = protocol({
  fork: fork
});