import {implement} from '../../protocol';
import {doto} from '../../core';
import IOffset from '../../protocols/ioffset';
import ICloneable from '../../protocols/icloneable';
import IShow from '../../protocols/ishow';

export default function Duration(milliseconds){
  this.milliseconds = milliseconds;
}

export function duration(milliseconds){
  return new Duration(milliseconds);
}

export const milliseconds = duration;

export function seconds(n){
  return duration(n * 1000);
}

export function minutes(n){
  return duration(n * 1000 * 60);
}

export function hours(n){
  return duration(n * 1000 * 60 * 60);
}

export function days(n){
  return duration(n * 1000 * 60 * 60 * 24);
}

export function weeks(n){
  return duration(n * 1000 * 60 * 60 * 24 * 7);
}

function op(setter, getter, label){
  return function(n){
    function increment(_, dt){
      var d = new Date(dt.valueOf());
      d[setter](d[getter]() + n);
      return d;
    }
    function decrement(_, dt){
      var d = new Date(dt.valueOf());
      d[setter](d[getter]() - n);
      return d;
    }
    function show(_){
      return n + " " + label;
    }
    return doto({},
      implement(IShow, {show: show}),
      implement(IOffset, {increment: increment, decrement: decrement}));
  }
}

export const months = op("setMonth"   , "getMonth"   , "months");
export const years  = op("setFullYear", "getFullYear", "years");

export function time(f){
  const start = Date.now();
  return Promise.resolve(f()).then(function(){
    const end = Date.now();
    return milliseconds(end - start);
  });
}