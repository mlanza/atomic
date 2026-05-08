import {protocol} from "../../types/protocol.js";
function compare(x, y){
  return x > y ? 1 : x < y ? -1 : 0;
}
export const IComparable = protocol({
  compare: compare
});