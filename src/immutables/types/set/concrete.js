import {seq, first, rest, cons, conj, includes, lazySeq, emptyList} from "atomic/core";
import {set} from "./construct.js";

function distinct2(coll, seen){
  return seq(coll) ? lazySeq(function(){
    let xs = coll;
    while (seq(xs)) {
      let x = first(xs);
      xs = rest(xs);
      if (!includes(seen, x)) {
        return cons(x, distinct2(xs, conj(seen, x)));
      }
    }
    return emptyList();
  }) : emptyList();
}

export function distinct(coll){
  return distinct2(coll, set());
}