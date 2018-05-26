import {protocol, satisfies} from "../types/protocol";
function _compare(x, y){
  return x > y ? 1 : x < y ? -1 : 0;
}
export const IComparable = protocol({
  compare: _compare
});
export const compare = IComparable.compare;
export const isComparable = satisfies(IComparable);
export default IComparable;