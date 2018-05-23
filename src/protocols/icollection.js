import {protocol, satisfies} from "../types/protocol";
export const ICollection = protocol({
  conj: null
});
export const conj = ICollection.conj;
export default ICollection;