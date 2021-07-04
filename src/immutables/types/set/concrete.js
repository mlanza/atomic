import * as _ from "atomic/core";
import {set} from "./construct.js";

function distinct2(coll, seen){
  return _.seq(coll) ? _.lazySeq(function(){
    let xs = coll;
    while (_.seq(xs)) {
      let x = _.first(xs);
      xs = _.rest(xs);
      if (!_.includes(seen, x)) {
        return _.cons(x, distinct2(xs, _.conj(seen, x)));
      }
    }
    return _.emptyList();
  }) : _.emptyList();
}

export function distinct(coll){
  return distinct2(coll, set());
}
