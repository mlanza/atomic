import {protocol} from "../../types/protocol.js";
import {includes} from "../iinclusive/concrete.js";
import {conj} from "../icollection/concrete.js";
function unite(self, value){
  return includes(self, value) ? self : conj(self, value);
}
export const ISet = protocol({
  unite,
  disj: null
});