import {identity, constantly, does} from "../../core.js";
import {satisfies, implement} from "../protocol.js";
import {IEquiv, IInclusive, IReversible, ISeq, ISeqable, ISequential, IEmptyableCollection, IKVReducible, IReducible, ICounted, IOmissible, IPrependable, IAppendable} from "../../protocols.js";
import {emptyList, EmptyList} from "../../types/empty-list/construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import * as p from "./protocols.js";
import {next} from "../../protocols/iseq/concrete.js";

function reduce(self, f, init){
  return init;
}

function append(self, x){
  return [x];
}

const prepend = append;

export function equiv(xs, ys){
  return !!satisfies(ISequential, xs) === !!satisfies(ISequential, ys)
    && p.count(xs) === p.count(ys)
    && p.equiv(p.first(xs), p.first(ys))
    && p.equiv(next(xs), next(ys));
}

export const iequiv = implement(IEquiv, {equiv});

export default does(
  iequiv,
  keying("EmptyList"),
  implement(ISequential),
  implement(IPrependable, {prepend}),
  implement(IAppendable, {append}),
  implement(IReversible, {reverse: emptyList}),
  implement(ICounted, {count: constantly(0)}),
  implement(IOmissible, {omit: identity}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IKVReducible, {reducekv: reduce}),
  implement(IReducible, {reduce}),
  implement(ISeq, {first: constantly(null), rest: emptyList}),
  implement(ISeqable, {seq: constantly(null)}));
