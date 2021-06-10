import {protocol} from "../../types/protocol.js";
function lookup(self, key){
  return self && self[key];
}
export const ILookup = protocol({lookup});