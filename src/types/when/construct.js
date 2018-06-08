import {IReduce, ILookup, IAssociative} from "../../protocols";

export function When(attrs){
  this.attrs = attrs;
}

export function when(year, month, day, hour, minute, second, millisecond){
  return new When({year, month, day, hour, minute, second, millisecond});
}

export function at(date, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(date, key));
  }, new When({}));
}

export function time(hour, minute, second, millisecond){
  return when(null, null, null, hour || 0, minute || 0, second || 0, millisecond || 0);
}

export function sod(){
  return time(0, 0, 0, 0);
}

export function eod(){
  return time(11, 59, 59, 999);
}

export function noon(){
  return time(12, 0, 0, 0);
}

export const midnight = sod;

export function som(){
  return when(null, null, 1);
}

export function eom(){
  return when(null, function(n){
    return n + 1;
  }, 0);
}

export function soy(){
  return when(null, 1, 1);
}

export function eoy(){
  return when(null, 12, 31);
}

export function year(n){
  return when(n);
}

export function month(n){
  return when(null, n);
}

export function day(n){
  return when(null, null, n);
}

export function hour(n){
  return when(null, null, null, n);
}

export function minute(n){
  return when(null, null, null, null, n);
}

export function second(n){
  return when(null, null, null, null, null, n);
}

export function millisecond(n){
  return when(null, null, null, null, null, null, n);
}

export function isWhen(self){
  return self && self.constructor === When;
}

export default When;