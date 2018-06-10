import {protocol, satisfies} from "../types/protocol";
import {IEncode} from "../protocols/iencode";
function hash(self, label, refstore, seed){
  return IHash.hash(JSON.stringify(IEncode.encode(self, label, refstore, seed)));
}
export const IHash = protocol({
  hash: hash
});
export const isHashable = satisfies(IHash);