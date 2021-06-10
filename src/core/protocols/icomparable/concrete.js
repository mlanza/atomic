import {IComparable} from "./instance.js";
import {type} from "../../core.js";
import {isNil} from "../../types/nil/construct.js";

export function compare(x, y){
  if (x === y) {
    return 0
  } else if (isNil(x)) {
    return -1;
  } else if (isNil(y)) {
    return 1;
  } else if (type(x) === type(y)) {
    return IComparable.compare(x, y);
  } else {
    throw new TypeError("Cannot compare different types.");
  }
}