import {implement} from '../../protocol';
import {doto} from '../../core';
import ICloneable from '../../protocols/icloneable';
import IShow from '../../protocols/ishow';

export default function Duration(milliseconds){
  this.milliseconds = milliseconds;
}

export function duration(milliseconds){
  return new Duration(milliseconds);
}

export function isDuration(self){
  return self instanceof Duration;
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

export function time(f){
  const start = Date.now();
  return Promise.resolve(f()).then(function(){
    const end = Date.now();
    return milliseconds(end - start);
  });
}