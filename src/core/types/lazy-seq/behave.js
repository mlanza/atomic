import {overload, identity, does, partial, comp, complement} from "../../core.js";
import {implement} from "../protocol.js";
import {ICompactible, IFunctor, IReversible, IOmissible, IInclusive, IFind, IEquiv, ICollection, ISeq, IReducible, IKVReducible, ISeqable, ISequential, IIndexed, IEmptyableCollection, ICounted, IAppendable, IPrependable} from "../../protocols.js";
import {reduced} from "../reduced.js";
import {cons} from "../list/construct.js";
import {map, filter, remove, detect, concat} from "./concrete.js";
import {emptyList} from "../empty-list/construct.js";
import {toArray} from "../array/concrete.js";
import {iequiv} from "../empty-list/behave.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {next} from "../../protocols/iseq/concrete.js";
import {reduce, reducekv} from "../../shared.js";
import * as p from "./protocols.js";

const compact = partial(filter, identity);

function fmap(self, f){
  return map(f, self);
}

function conj(self, value){
  return cons(value, self);
}

function seq(self){
  return p.seq(self.perform());
}

function iterate(self){
  let state = self;
  return {
    next: function(){
      let result = p.seq(state) ? {value: p.first(state), done: false} : {done: true};
      state = next(state);
      return result;
    }
  };
}

function iterator(){
  return iterate(this);
}

export function iterable(Type){
  Type.prototype[Symbol.iterator] = iterator;
}

export function find(coll, key){
  return reducekv(coll, function(memo, k, v){
    return key === k ? reduced([k, v]) : memo;
  }, null);
}

function first(self){
  return p.first(self.perform());
}

function rest(self){
  return p.rest(self.perform());
}

function nth(self, n){
  let xs  = self,
      idx = 0;
  while (xs) {
    let x = p.first(xs);
    if (idx === n) {
      return x;
    }
    idx++;
    xs = next(xs);
  }
  return null;
}

function idx(self, x){
  let xs = p.seq(self),
      n  = 0;
  while(xs){
    if (x === p.first(xs)) {
      return n;
    }
    n++;
    xs = next(xs);
  }
  return null;
}

function count(self){
  return reduce(self, function(memo){
    return memo + 1;
  }, 0);
}

function append(self, other){
  return concat(self, [other]);
}

function omit(self, value){
  return remove(p.equiv(value, ?), self);
}

function includes(self, value){
  return detect(p.equiv(value, ?), self);
}

const reverse = comp(p.reverse, toArray);

export const reductive = does(
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}));

export default does(
  iterable,
  iequiv,
  reductive,
  keying("LazySeq"),
  implement(ISequential),
  implement(IIndexed, {nth, idx}),
  implement(IReversible, {reverse}),
  implement(ICompactible, {compact}),
  implement(IInclusive, {includes}),
  implement(IOmissible, {omit}),
  implement(IFunctor, {fmap}),
  implement(ICollection, {conj}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: conj}),
  implement(ICounted, {count}),
  implement(IFind, {find}),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}));
