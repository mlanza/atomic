import {protocol, satisfies} from "../protocol";
import {partial, isNil, type} from "../core";

function isIdentical(x, y){ //TODO via protocol
  return x === y;
}

export const IComparable = protocol({
  _compare: function(x, y){
    return x > y ? 1 : x < y ? -1 : 0;
  }
});

export function compare(x, y){
  if (isIdentical(x, y)) {
    return 0
  } else if (isNil(x)) {
    return -1;
  } else if (isNil(y)) {
    return 1;
  } else if (type(x) === type(y)) {
    return IComparable._compare(x, y);
  }
}

export const isComparable = partial(satisfies, IComparable);
export default IComparable;