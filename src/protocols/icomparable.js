import {protocol, satisfies} from "../types/protocol";
export const IComparable = protocol({
  compare: function(x, y){
    return x > y ? 1 : x < y ? -1 : 0;
  }
});
export const compare = IComparable.compare;
export const isComparable = satisfies(IComparable);
export default IComparable;