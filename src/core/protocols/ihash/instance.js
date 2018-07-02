import {protocol} from "../../types/protocol";
import IEncode from "../iencode/instance";
function hash(self, label, refstore, seed){
  return IHash.hash(JSON.stringify(IEncode.encode(self, label, refstore, seed)));
}
export const IHash = protocol({
  hash: hash
});
export default IHash;