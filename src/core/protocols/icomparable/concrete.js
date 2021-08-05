import {everyPair, or, overload, constantly} from "../../core.js";
import {IComparable} from "./instance.js";
import {isNil} from "../../types/nil/construct.js";
import {equiv} from "../../protocols/iequiv/concrete.js";

export function compare(x, y){
  if (x === y) {
    return 0
  } else if (isNil(x)) {
    return -1;
  } else if (isNil(y)) {
    return 1;
  } else if (x.constructor.name === y.constructor.name) { //TODO need a more robust check
    return IComparable.compare(x, y);
  } else {
    throw new TypeError("Cannot compare different types.");
  }
}

function lt2(a, b){
  return compare(a, b) < 0;
}

function ltN(...args){
  return everyPair(lt2, args);
}

export const lt = overload(constantly(false), constantly(true), lt2, ltN);

const lte2 = or(lt2, equiv);

function lteN(...args){
  return everyPair(lte2, args);
}

export const lte = overload(constantly(false), constantly(true), lte2, lteN);

function gt2(a, b){
  return compare(a, b) > 0;
}

function gtN(...args){
  return everyPair(gt2, args);
}

export const gt = overload(constantly(false), constantly(true), gt2, gtN);

const gte2 = or(equiv, gt2);

function gteN(...args){
  return everyPair(gte2, args);
}

export const gte = overload(constantly(false), constantly(true), gte2, gteN);
