import {seq, first, rest, conj, includes, lazySeq, emptyList} from "cloe/core";
import {set} from "./construct";

function distinct2(coll, seen){
  if (seq(coll)) {
    let fst = first(coll);
    if (includes(seen, fst)) {
      return distinct2(rest(coll), seen);
    } else {
      return lazySeq(fst, function(){
        return distinct2(rest(coll), conj(seen, fst));
      });
    }
  } else {
    return emptyList();
  }
}

export function distinct(coll){
  return distinct2(coll, set());
}