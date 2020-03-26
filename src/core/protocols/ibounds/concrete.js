import {IBounds} from "./instance";
import {IComparable} from "../../protocols/icomparable";
import {filtera} from "../../types/lazy-seq/concrete";
import {isSome} from "../../types/nil";
import {min, max} from "../../types/number/concrete";
import {spread} from "../../types/function/concrete";
import {_ as v} from "param.macro";

export const start = IBounds.start;
export const end = IBounds.end;

function chronology(item){
  const s = start(item), e = end(item);
  return s == null || e == null ? [s, e] : [s, e].sort(IComparable.compare);
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
  return (sr == null || IComparable.compare(b, sr) >= 0) && (er == null || IComparable.compare(b, er) < 0);
}

export function between(a, b){
  const [sa, ea] = chronology(a),
        [sb, eb] = chronology(b);
  return inside(sa, ea, sb) && inside(sa, ea, eb);
}

export function overlap(a, b){
  const [sa, ea] = chronology(a),
        [sb, eb] = chronology(b),
        s = max(sa, sb),
        e = [ea, eb] |> filtera(isSome, v) |> spread(min);
  return s == null || e == null || IComparable.compare(s, e) < 0 ? new a.constructor(s, e) : null;
}