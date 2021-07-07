import {identity, does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {EmptyList, emptyList} from "../../types/empty-list/construct.js";
import {cons} from "../../types/list/construct.js";
import {range} from "../../types/range/construct.js";
import {Reduced, unreduced} from "../../types/reduced.js";
import {ISequential, ICoerceable, ILookup, IMap, IClonable, IReduce, ICollection, IEmptyableCollection, INext, ISeq, ICounted, ISeqable, IIndexed} from "../../protocols.js";
import {revSeq} from "./construct.js";
import {iterable} from "../lazy-seq/behave.js";
import {map} from "../lazy-seq/concrete.js";
import * as p from "./protocols.js";

function clone(self){
  return new revSeq(self.coll, self.idx);
}

function count(self){
  return p.count(self.coll);
}

function keys(self){
  return range(count(self));
}

function vals(self){
  return map(nth(self, ?), keys(self));
}

function nth(self, idx){
  return p.nth(self.coll, count(self) - 1 - idx);
}

function first(self){
  return p.nth(self.coll, self.idx);
}

function rest(self){
  return p.next(self) || emptyList();
}

function next(self){
  return self.idx > 0 ? revSeq(self.coll, self.idx - 1) : null;
}

function conj(self, value){
  return cons(value, self);
}

function reduce2(coll, f){
  let xs = p.seq(coll);
  return xs ? p.reduce(f, p.first(xs), p.next(xs)) : f();
}

function reduce3(coll, f, init){
  let memo = init,
      xs   = p.seq(coll);
  while(xs){
    memo = f(memo, p.first(xs));
    if (memo instanceof Reduced) {
      return unreduced(memo);
    }
    xs = p.next(xs);
  }
  return memo;
}

const reduce = overload(null, null, reduce2, reduce3);

export default does(
  iterable,
  implement(ISequential),
  implement(ICounted, {count}),
  implement(IIndexed, {nth}),
  implement(ILookup, {lookup: nth}),
  implement(IMap, {keys, vals}),
  implement(ICoerceable, {toArray: Array.from}),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(IReduce, {reduce}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ISeqable, {seq: identity}),
  implement(IClonable, {clone}));
