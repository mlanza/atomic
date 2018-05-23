import {protocol, satisfies} from "../types/protocol";
import {overload} from "../core";
export const IReduce = protocol({
  reduce: null
});
export const reduce = IReduce.reduce;
export default IReduce;