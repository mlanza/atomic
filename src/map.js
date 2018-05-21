import * as p from "./protocols";
import {identity} from "./core";
import {partial} from "./types/function";
import {lazySeq} from "./types/lazyseq";
import {set} from "./types/set";
import {concatenated} from "./types/concatenated";
import {EMPTY} from "./types/empty";

export function map(f, xs){
  return p.seq(xs) ? lazySeq(f(p.first(xs)), function(){
    return map(f, p.rest(xs));
  }) : EMPTY;
}

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

export function filter(pred, xs){
  const coll = p.seq(xs);
  if (!coll) return EMPTY;
  const head = p.first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, p.rest(coll));
  }) : filter(pred, p.rest(coll));
}

function distinct2(coll, seen){
  if (p.seq(coll)) {
    let fst = p.first(coll);
    if (seen.has(fst)) {
      return distinct2(p.rest(coll), seen);
    } else {
      return lazySeq(fst, function(){
        return distinct2(p.rest(coll), seen.add(fst));
      });
    }
  } else {
    return EMPTY;
  }
}

export function distinct(coll){
  return distinct2(coll, set());
}

export const compact = partial(filter, identity);