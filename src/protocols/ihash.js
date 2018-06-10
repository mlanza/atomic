import {protocol, satisfies} from "../types/protocol";
import {IEncode} from "../protocols/iencode";
function hash(self){
  return IHash.hash(JSON.stringify(IEncode.encode(self)));
}
export const IHash = protocol({
  hash: hash
});
export const isHashable = satisfies(IHash);