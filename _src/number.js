import {subj, multiarity} from './core/function.js';
import * as number from './core/number.js';
import {cons} from './core/cons.js';
import {iterate} from './cons.js';
export const add = subj(number.add);
export const subtract = subj(number.subtract);
export const inc = add(1);
export const dec = subtract(1);
export const increasingly = iterate(inc);
export const decreasingly = iterate(dec);

export const range = multiarity(function(){ //TODO number range, date range, string range, etc.
  return iterate(inc, 0);
}, function(end){
  return range(0, end, 1);
}, function(start, end){
  return range(start, end, 1);
}, function(start, end, step){
  var next = start + step;
  return next >= end ? cons(start) : cons(start, function(){
    return range(next, end, step);
  });
});
