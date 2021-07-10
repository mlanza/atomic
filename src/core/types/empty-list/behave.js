import {identity, constantly, does} from "../../core.js";
import {satisfies, implement} from "../protocol.js";
import {IEquiv, IBlankable, ICoercible, IInclusive, IReversible, INext, ISeq, ISeqable, ISequential, IEmptyableCollection, IKVReduce, IReduce, ICounted} from "../../protocols.js";
import {emptyList, EmptyList} from "../../types/empty-list/construct.js";
import {emptyArray} from "../../types/array/construct.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

function reduce(self, f, init){
  return init;
}

export function equiv(xs, ys){
  return !!satisfies(ISequential, xs) === !!satisfies(ISequential, ys)
    && p.count(xs) === p.count(ys)
    && p.equiv(p.first(xs), p.first(ys))
    && p.equiv(p.next(xs), p.next(ys));
}

export const iequiv = implement(IEquiv, {equiv});

export default does(
  iequiv,
  implement(ISequential),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IReversible, {reverse: emptyList}),
  implement(ICounted, {count: constantly(0)}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IKVReduce, {reducekv: reduce}),
  implement(IReduce, {reduce}),
  implement(ICoercible, {toArray: emptyArray}),
  implement(ISeq, {first: constantly(null), rest: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}));
