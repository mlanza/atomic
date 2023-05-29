import {does, overload, constantly, identity, partial} from "../../core.js";
import {implement} from "../protocol.js";
import {isNumber} from "../number.js";
import {mergeWith} from "../../protocols/imergable/instance.js";
import {days} from "../duration.js";
import {IHashable, IAddable, IReducible, IKVReducible, ISeqable, IBounded, IMap, IDeref, IComparable, IEquiv, ICloneable, ILookup, IAssociative, ICollection} from "../../protocols.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function add(self, other){
  return mergeWith(p.add, self, isNumber(other) ? days(other) : other);
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
  return p.reduce(function(memo, key){
    memo.push(p.get(self, key));
    return memo;
  }, [], keys(self));
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
  return other != null && deref(self) === p.deref(other);
}

function compare(self, other){
  return other == null ? -1 : deref(self) - p.deref(other);
}

function reduce(self, f, init){
  return p.reduce(function(memo, key){
    const value = p.get(self, key);
    return f(memo, [key, value]);
  }, init, keys(self));
}

function reducekv(self, f, init){
  return reduce(self, function(memo, [key, value]){
    return f(memo, key, value);
  }, init);
}

function deref(self){
  return self.valueOf();
}

function hash(self){
  return self.valueOf();
}

export default does(
  keying("Date"),
  implement(IHashable, {hash}),
  implement(IAddable, {add}),
  implement(IDeref, {deref}),
  implement(IBounded, {start: identity, end: identity}),
  implement(ISeqable, {seq: identity}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(IMap, {keys, vals}),
  implement(IComparable, {compare}),
  implement(ICollection, {conj}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(ICloneable, {clone}));
