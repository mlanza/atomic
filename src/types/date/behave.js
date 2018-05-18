import {effect, overload, constantly} from '../../core';
import {implement} from '../../protocol';
import {IUnit, IShow, ICloneable, IDeref, ILookup, IAssociative} from '../../protocols';
import {isNumber} from '../../types/number';
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

function show(self){
  return "\"" + self.toISOString() + "\"";
}

function unit2(self, amount){
  return isNumber(amount) ? days(amount) : amount;
}

export default effect(
  implement(IUnit, {unit: overload(null, constantly(days(1)), unit2)}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(ICloneable, {clone}),
  implement(IShow, {show}));