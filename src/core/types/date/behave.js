import {does, overload, constantly, identity} from '../../core';
import {implement, specify} from '../protocol';
import {IReduce, IKVReduce, ISeqable, IEncode, IBounds, IMap, IDeref, ISeq, IComparable, IEquiv, ICloneable, ILookup, IAssociative, ICollection} from '../../protocols';
import {isNumber} from '../number';
import {lazySeq} from '../lazy-seq';
import {days} from '../days';
import {isDate} from "./concrete";
import Symbol from '../symbol/construct';

function lookup(self, key){
  switch(key){
    case "year":
      return self.getFullYear();
    case "month":
      return self.getMonth() + 1;
    case "day":
      return self.getDate();
    case "hours":
      return self.getHours();
    case "minutes":
      return self.getMinutes();
    case "seconds":
      return self.getSeconds();
    case "milliseconds":
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
  return ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds"];
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
  var dt = new Date(self.valueOf());
  switch(key){
    case "year":
      dt.setFullYear(value);
      break;
    case "month":
      dt.setMonth(value - 1); //abstract away javascript's base 0 months!
      break;
    case "day":
      dt.setDate(value);
      break;
    case "hours":
      dt.setHours(value);
      break;
    case "minutes":
      dt.setMinutes(value);
      break;
    case "seconds":
      dt.setSeconds(value);
      break;
    case "milliseconds":
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

function show(self){
  return "\"" + self.toISOString() + "\"";
}

function unit2(self, amount){
  return isNumber(amount) ? days(amount) : amount;
}

function equiv(self, other){
  return other != null && IDeref.deref(self) === IDeref.deref(other);
}

function compare(self, other){
  return other == null ? -1 : IDeref.deref(self) - IDeref.deref(other);
}

function encode(self, label){
  return IAssociative.assoc({data: self.valueOf()}, label, self[Symbol.toStringTag]);
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

export default does(
  implement(IDeref, {deref}),
  implement(IBounds, {start: identity, end: identity}),
  implement(ISeqable, {seq: identity}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IEncode, {encode}),
  implement(IEquiv, {equiv}),
  implement(IMap, {keys, vals}),
  implement(IComparable, {compare}),
  implement(ICollection, {conj}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(ICloneable, {clone}));