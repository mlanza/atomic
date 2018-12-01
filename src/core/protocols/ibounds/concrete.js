import IBounds from "./instance";
import {IComparable} from "../../protocols/icomparable";

export const start = IBounds.start;
export const end = IBounds.end;

export function inside(sr, er, b){
  if (b == null) {
    return false;
  }
  if (sr == null && er == null) {
    return true;
  }
  return (sr == null || IComparable.compare(b, sr) >= 0) && (er == null || IComparable.compare(b, er) <= 0);
}

export function between(a, b){
  const [sa, ea] = [start(a), end(a)].sort(IComparable.compare),
        [sb, eb] = [start(b), end(b)].sort(IComparable.compare);
  return inside(sa, ea, sb) && inside(sa, ea, eb);
}

export function overlap(a, b){
  const [sa, ea] = [start(a), end(a)].sort(IComparable.compare),
        [sb, eb] = [start(b), end(b)].sort(IComparable.compare);
  return (
    inside(sa, ea, sb) ||
    inside(sa, ea, eb) ||
    inside(sb, eb, sa) ||
    inside(sb, eb, ea));
}