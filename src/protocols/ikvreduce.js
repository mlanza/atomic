import {protocol, satisfies} from "../types/protocol";
export const IKVReduce = protocol({
  reducekv: null
});
export const reducekv = IKVReduce.reducekv;
export default IKVReduce;