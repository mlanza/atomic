import {protocol, satisfies} from "../types/protocol";
import {IComparable} from "../protocols/icomparable";

export const IBounds = protocol({
  start: null,
  end: null
});

export const hasBounds = satisfies(IBounds);

export function between(a, b){
  const [sa, ea] = [IBounds.start(a), IBounds.end(a)].sort(IComparable.compare),
        [sb, eb] = [IBounds.start(b), IBounds.end(b)].sort(IComparable.compare);
  return sa != null & ea != null && sb != null & eb != null && IComparable.compare(sb, sa) >= 0 && IComparable.compare(eb, ea) <= 0;
}

export function overlap(a, b){
  const [sa, ea] = [IBounds.start(a), IBounds.end(a)].sort(IComparable.compare),
        [sb, eb] = [IBounds.start(b), IBounds.end(b)].sort(IComparable.compare);
  return sa != null & ea != null && sb != null & eb != null && (IComparable.compare(sb, sa) >= 0 && IComparable.compare(sb, ea) <= 0) || (IComparable.compare(eb, sa) >= 0 && IComparable.compare(eb, ea) <= 0);
}