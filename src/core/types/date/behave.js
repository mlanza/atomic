import {does, overload, constantly, identity} from '../../core';
import {implement} from '../protocol';
import {IAddable, IReduce, IKVReduce, ISeqable, IBounds, IMap, IDeref, ISeq, IComparable, IEquiv, ICloneable, ILookup, IAssociative, ICollection} from '../../protocols';
import {isNumber} from '../number';
import {days} from '../duration';
import {Symbol} from '../symbol/construct';

function add(self, dur){
  return IKVReduce.reducekv(dur, function(self, key, value){
    return IAssociative.assoc(self, key, ILookup.lookup(self, key) + value);
  }, self);
}

function lookup(self, key){
  switch(key){
    case "year":
      return self.getFullYear();
    case "month":
      return self.getMonth();
    case "day":
      return self.getDate();
    case "hour":
      return self.getHours();
    case "minute":
      return self.getMinutes();
    case "second":
      return self.getSeconds();
    case "millisecond":
      return self.getMilliseconds();
  }
}

function InvalidKeyError(key, target){
  this.key = key;
  this.target = target;
}

function contains(self, key){
  return keys(self).indexOf(key) > -1;
}

function keys(self){
  return ["year", "month", "day", "hour", "minute", "second", "millisecond"];
}

function vals(self){
  return IReduce.reduce(keys(self), function(memo, key){
    memo.push(ILookup.lookup(self, key));
    return memo;
  }, []);
}

function conj(self, [key, value]){
  return assoc(self, key, value);
}

//the benefit of exposing internal state as a map is assocIn and updateIn
function assoc(self, key, value){
  const dt = new Date(self.valueOf());
  switch(key){
    case "year":
      dt.setFullYear(value);
      break;
    case "month":
      dt.setMonth(value);
      break;
    case "day":
      dt.setDate(value);
      break;
    case "hour":
      dt.setHours(value);
      break;
    case "minute":
      dt.setMinutes(value);
      break;
    case "second":
      dt.setSeconds(value);
      break;
    case "millisecond":
      dt.setMilliseconds(value);
      break;
    default:
      throw new InvalidKeyError(key, self);
  }
  return dt;
}

function clone(self){
  return new Date(self.valueOf());
}

function equiv(self, other){
  return other != null && IDeref.deref(self) === IDeref.deref(other);
}

function compare(self, other){
  return other == null ? -1 : IDeref.deref(self) - IDeref.deref(other);
}

function reduce(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    const value = ILookup.lookup(self, key);
    return xf(memo, [key, value]);
  }, init);
}

function reducekv(self, xf, init){
  return reduce(self, function(memo, [key, value]){
    return xf(memo, key, value);
  }, init);
}

function deref(self){
  return self.valueOf();
}

export const behaveAsDate = does(
  implement(IAddable, {add}),
  implement(IDeref, {deref}),
  implement(IBounds, {start: identity, end: identity}),
  implement(ISeqable, {seq: identity}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(IMap, {keys, vals}),
  implement(IComparable, {compare}),
  implement(ICollection, {conj}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(ICloneable, {clone}));