import {identity, overload, does} from "../../core.js";
import {implement} from "../protocol.js";
import {indexedSeq} from "./construct.js";
import {revSeq} from "../../types/rev-seq/construct.js";
import {drop, detect, concat} from "../lazy-seq/concrete.js";
import {emptyArray} from "../../types/array/construct.js";
import {iequiv} from "../../types/empty-list/behave.js";
import {iterable} from "../lazy-seq/behave.js";
import {IHashable, IEquiv, IReversible, IMapEntry, IFind, IInclusive, IAssociative, IAppendable, IPrependable, ICollection, ICounted, IReducible, IKVReducible, ISeq, ISeqable, ISequential, IIndexed, ILookup, IFn, IEmptyableCollection} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashKeyed as hash} from "../../protocols/ihashable/hashers.js";
import {next} from "../../protocols/iseq/concrete.js";
import {reduce, reducekv} from "../../shared.js";
import * as p from "./protocols.js";

function reverse(self){
  let c = count(self);
  return c > 0 ? revSeq(self, c - 1) : null;
}

function key(self){
  return lookup(self, 0);
}

function val(self){
  return lookup(self, 1);
}

function find(self, key){
  return contains(self, key) ? [key, lookup(self, key)] : null;
}

function contains(self, key){
  return key < p.count(self.seq) - self.start;
}

function lookup(self, key){
  return p.get(self.seq, self.start + key);
}

function append(self, x){
  return concat(self, [x]);
}

function prepend(self, x){
  return concat([x], self);
}

function nth(self, idx){
  return p.nth(self.seq, idx + self.start);
}

function idx2(self, x){
  return idx3(self, x, 0);
}

function idx3(self, x, idx){
  if (first(self) === x) {
    return idx;
  }
  const nxt = next(self);
  return nxt ? idx3(nxt, x, idx + 1) : null;
}

const idx = overload(null, null, idx2, idx3);

function first(self){
  return nth(self, 0);
}

function rest(self){
  return indexedSeq(self.seq, self.start + 1);
}

function count(self){
  return p.count(self.seq) - self.start;
}

function includes(self, x){
  return detect(p.equiv(x, ?), drop(self.start, self.seq));
}

export default does(
  iterable,
  iequiv,
  keying("IndexedSeq"),
  implement(ISequential),
  implement(IHashable, {hash}),
  implement(IIndexed, {nth, idx}),
  implement(IReversible, {reverse}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IFind, {find}),
  implement(IAssociative, {contains}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: emptyArray}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ICollection, {conj: append}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));
