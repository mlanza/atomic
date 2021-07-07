import {IBounds} from "./instance.js";
import {compare} from "../../protocols/icomparable.js";
import {isNil} from "../../types/nil.js";
import {constructs} from "../../core.js";
import {gt, lt, lte} from "../../predicates.js";

export const start = IBounds.start;
export const end = IBounds.end;

function chronology(item){
  const s = start(item), e = end(item);
  return s == null || e == null ? [s, e] : [s, e].sort(compare);
}

//The end range value must also be the start range value of the next successive range to avoid infinitisimally small gaps.
//As such, the end range value cannot itself be considered part of a range, for if it did that value would nonsensically belong to two successive ranges.

export function inside(sr, er, b){
  if (b == null) {
    return false;
  }
  if (sr == null && er == null) {
    return true;
  }
  return (sr == null || compare(b, sr) >= 0) && (er == null || compare(b, er) < 0);
}

export function between(a, b){
  const [sa, ea] = chronology(a),
        [sb, eb] = chronology(b);
  return inside(sa, ea, sb) && inside(sa, ea, eb);
}

export function overlap(self, other){
  const make = constructs(self.constructor),
        ss = start(self),
        es = end(self),
        so = start(other),
        eo = end(other),
        sn = isNil(ss) || isNil(so) ? ss || so : gt(ss, so) ? ss : so,
        en = isNil(es) || isNil(eo) ? es || eo : lt(es, eo) ? es : eo
  return lte(sn, en) ? make(sn, en) : null;
}
