import {protocol, satisfies} from "../types/protocol";
function compare(x, y){
  return x > y ? 1 : x < y ? -1 : 0;
}
export const IComparable = protocol({
  compare: compare
});
export const isComparable = satisfies(IComparable);
