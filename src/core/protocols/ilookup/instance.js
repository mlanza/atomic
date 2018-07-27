import {protocol} from "../../types/protocol";
function lookup(self, key){
  return self && self[key];
}
export const ILookup = protocol({lookup});
export default ILookup;