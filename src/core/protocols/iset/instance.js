import {protocol} from "../../types/protocol";
import {includes} from "../iinclusive/concrete";
import {conj} from "../icollection/concrete";
function unite(self, value){
  return includes(self, value) ? self : conj(self, value);
}
export const ISet = protocol({
  unite,
  disj: null
});