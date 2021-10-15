import {does, identity, constructs, branch, overload, isString} from "../../core.js";
import {implement} from "../protocol.js";
import {IHash, IMergable, IBlankable, ICompactible, IComparable, IOmissible, INext, ICollection, IEquiv, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, ICoercible, IClonable, IInclusive, ITemplate} from "../../protocols.js";
import {reduced} from "../reduced.js";
import {lazySeq, into, map} from "../lazy-seq.js";
import {cons} from "../list.js";
import {apply} from "../function/concrete.js";
import {satisfies} from "../protocol/concrete.js";
import {update} from "../../protocols/iassociative/concrete.js";
import {emptyObject} from "../object/construct.js";
import {descriptive, isObject} from "../object/concrete.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import {hashKeyed} from "../../protocols/ihash/concrete.js";

const keys = Object.keys;
const vals = Object.values;

function fill(self, params){
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, key,
      value |> branch(
        isString, p.fill(?, params),
        isObject, fill(?, params),
        identity));
  }, {}, self);
}

function merge(...maps){
  return p.reduce(function(memo, map){
    return p.reduce(function(memo, [key, value]){
      memo[key] = value;
      return memo;
    }, memo, p.seq(map));
  }, {}, maps);
}

function blank(self){
  return keys(self).length === 0;
}

function compact1(self){
  return compact2(self, function([_, value]){
    return value == null;
  });
}

function compact2(self, pred){
  return p.reducekv(function(memo, key, value){
    return pred([key, value]) ? memo : p.assoc(memo, key, value);
  }, {}, self);
}

const compact = overload(null, compact1, compact2);

function omit(self, entry){
  const key = p.key(entry);
  if (includes(self, entry)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function compare(self, other){ //assume like keys, otherwise use your own comparator!
  return p.equiv(self, other) ? 0 : descriptive(other) ? p.reduce(function(memo, key){
    return memo == 0 ? p.compare(p.get(self, key), p.get(other, key)) : reduced(memo);
  }, 0, p.keys(self)) : -1;
}

function conj(self, entry){
  const key = p.key(entry),
        val = p.val(entry);
  const result = p.clone(self);
  result[key] = val;
  return result;
}

function equiv(self, other){
  return self === other ? true : descriptive(other) && p.count(p.keys(self)) === p.count(p.keys(other)) && p.reduce(function(memo, key){
    return memo ? p.equiv(p.get(self, key), p.get(other, key)) : reduced(memo);
  }, true, p.keys(self));
}

function find(self, key){
  return contains(self, key) ? [key, lookup(self, key)] : null;
}

function includes(self, entry){
  const key = p.key(entry),
        val = p.val(entry);
  return self[key] === val;
}

function lookup(self, key){
  return self[key];
}

function first(self){
  const key = p.first(keys(self));
  return key ? [key, lookup(self, key)] : null;
}

function rest(self){
  return next(self) || {};
}

function next2(self, keys){
  if (p.seq(keys)) {
    return lazySeq(function(){
      const key = p.first(keys);
      return cons([key, lookup(self, key)], next2(self, p.next(keys)));
    });
  } else {
    return null;
  }
}

function next(self){
  return next2(self, p.next(keys(self)));
}

function dissoc(self, key){
  if (p.contains(self, key)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function assoc(self, key, value){
  if (p.get(self, key) === value) {
    return self;
  } else {
    const result = clone(self);
    result[key] = value;
    return result;
  }
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function seq(self){
  if (!count(self)) return null;
  return map(function(key){
    return [key, lookup(self, key)];
  }, keys(self));
}

function count(self){
  return keys(self).length;
}

function clone(self){
  return Object.assign({}, self);
}

function reduce(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, [key, lookup(self, key)]);
  }, init, keys(self));
}

function reducekv(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, key, lookup(self, key));
  }, init, keys(self));
}

function toArray(self){
  return reduce(self, function(memo, pair){
    memo.push(pair);
    return memo;
  }, []);
}

function hash(self){
  return hashKeyed(self);
}

export default does(
  naming("Object"),
  implement(IHash, {hash}),
  implement(ITemplate, {fill}),
  implement(IBlankable, {blank}),
  implement(IMergable, {merge}),
  implement(ICompactible, {compact}),
  implement(IEquiv, {equiv}),
  implement(ICoercible, {toArray, toObject: identity}),
  implement(IFind, {find}),
  implement(IOmissible, {omit}),
  implement(IInclusive, {includes}),
  implement(ICollection, {conj}),
  implement(IClonable, {clone}),
  implement(IComparable, {compare}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IFn, {invoke: lookup}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ILookup, {lookup}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
