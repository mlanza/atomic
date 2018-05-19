import {protocol, satisfies} from "../protocol";
export const IComparable = protocol({
  compare: function(x, y){
    return x > y ? 1 : x < y ? -1 : 0;
  }
});
export const isComparable = satisfies(IComparable);
export default IComparable;