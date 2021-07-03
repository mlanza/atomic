import {IComparable} from "./instance.js";
import {isNil} from "../../types/nil/construct.js";
import {what} from "../../protocols/inamable/concrete.js";

export function compare(x, y){
  if (x === y) {
    return 0
  } else if (isNil(x)) {
    return -1;
  } else if (isNil(y)) {
    return 1;
  } else if (x.constructor === y.constructor) { //TODO use `what`?
    return IComparable.compare(x, y);
  } else {
    throw new TypeError("Cannot compare different types.");
  }
}
