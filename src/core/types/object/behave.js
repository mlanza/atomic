import {does, identity, constructs, branch} from "../../core.js";
import {implement} from "../protocol.js";
import {IMergable, IBlankable, ICompactible, IComparable, IOmissible, IMatchable, INext, ICollection, IEquiv, IMapEntry, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, ICoerceable, IClonable, IInclusive, ITemplate} from "../../protocols.js";
import {reduced} from "../reduced.js";
import {lazySeq, into, map} from "../lazy-seq.js";
import {cons} from "../list.js";
import {apply} from "../function/concrete.js";
import {isString} from "../string/construct.js";
import {satisfies} from "../protocol/concrete.js";
import {update} from "../../protocols/iassociative/concrete.js";
import {emptyObject, isObject} from "../object/construct.js";
import {descriptive} from "../object/concrete.js";

const keys = Object.keys;
const vals = Object.values;

Object.from = ICoerceable.toObject;

function fill(self, params){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key,
      value |> branch(
        isString, ITemplate.fill(?, params),
        isObject, fill(?, params),
        identity));
  }, {});
}

function merge(...maps){
  return IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, [key, value]){
      memo[key] = value;
      return memo;
    }, memo);
  }, {});
}

function blank(self){
  return keys(self).length === 0;
}

function compact(self){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return value == null ? memo : IAssociative.assoc(memo, key, value);
  }, {});
}

function matches(self, template){
  return IKVReduce.reducekv(template, function(memo, key, value){
    return memo ? IEquiv.equiv(ILookup.lookup(self, key), value) : reduced(memo);
  }, true);
}

function omit(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  if (includes(self, entry)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function compare(self, other){ //assume like keys, otherwise use your own comparator!
  return IEquiv.equiv(self, other) ? 0 : descriptive(other) ? IReduce.reduce(IMap.keys(self), function(memo, key){
    return memo == 0 ? IComparable.compare(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced(memo);
  }, 0) : -1;
}

function conj(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  const result = IClonable.clone(self);
  result[key] = val;
  return result;
}

function equiv(self, other){
  return self === other ? true : descriptive(other) && ICounted.count(IMap.keys(self)) === ICounted.count(IMap.keys(other)) && IReduce.reduce(IMap.keys(self), function(memo, key){
    return memo ? IEquiv.equiv(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced(memo);
  }, true);
}

function find(self, key){
  return contains(self, key) ? [key, lookup(self, key)] : null;
}

function includes(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  return self[key] === val;
}

function lookup(self, key){
  return self[key];
}

function first(self){
  const key = ISeq.first(keys(self));
  return key ? [key, lookup(self, key)] : null;
}

function rest(self){
  return next(self) || {};
}

function next2(self, keys){
  if (ISeqable.seq(keys)) {
    return lazySeq(function(){
      const key = ISeq.first(keys);
      return cons([key, lookup(self, key)], next2(self, INext.next(keys)));
    });
  } else {
    return null;
  }
}

function next(self){
  return next2(self, INext.next(keys(self)));
}

function dissoc(self, key){
  if (IAssociative.contains(self, key)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function assoc(self, key, value){
  if (ILookup.lookup(self, key) === value) {
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

function reduce(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, [key, lookup(self, key)]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init);
}

function toArray(self){
  return reduce(self, function(memo, pair){
    memo.push(pair);
    return memo;
  }, []);
}

export default does(
  implement(ITemplate, {fill}),
  implement(IBlankable, {blank}),
  implement(IMergable, {merge}),
  implement(ICompactible, {compact}),
  implement(IEquiv, {equiv}),
  implement(ICoerceable, {toArray: toArray, toObject: identity}),
  implement(IFind, {find}),
  implement(IOmissible, {omit}),
  implement(IMatchable, {matches}),
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
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
