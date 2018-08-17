import {protocol} from "../../types/protocol";
function fork(self, reject, resolve){
  return resolve(self);
}
export const IFork = protocol({
  fork: fork
});
export default IFork;