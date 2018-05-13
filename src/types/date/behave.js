import {effect, overload} from '../../core';
import {implement} from '../../protocol';
import IShow from '../../protocols/ishow';
import IOffset from '../../protocols/ioffset';
import ICloneable from '../../protocols/icloneable';
import IDeref from '../../protocols/ideref';
import ILookup from '../../protocols/ilookup';
import IAssociative from '../../protocols/iassociative';
import {days} from '../../types/duration';

function lookup(self, key){
  switch(key){
    case "year":
      return self.getFullYear();
    case "month":
      return self.getMonth() + 1;
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
  return ["year", "month", "day", "hour", "minute", "second", "millisecond"].indexOf(key) > -1;
}

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

function inc1(self){
  return IOffset.increment(days(1), self);
}

function inc2(self, offset){
  return IOffset.increment(offset, self);
}

function dec1(self){
  return IOffset.decrement(days(1), self);
}

function dec2(self, offset){
  return IOffset.decrement(offset, self);
}

const inc = overload(null, inc1, inc2);
const dec = overload(null, dec1, dec2);

function clone(self){
  return new Date(self.valueOf());
}

function show(self){
  return "\"" + self.toISOString() + "\"";
}

export default effect(
  implement(IAssociative, {assoc: assoc, contains: contains}),
  implement(ILookup, {lookup: lookup}),
  implement(ICloneable, {clone: clone}),
  implement(IOffset, {inc: inc, dec: dec}),
  implement(IShow, {show: show}));