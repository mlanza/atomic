import {overload, identity, constantly, complement} from "../../core";
import {IReduce, ICounted, IComparable, IAddable} from "../../protocols";
import {partial, unary} from "../function";
import {reducing} from "../../protocols/ireduce/concrete";

export function number(...args){
  return Number(...args);
}

export const num   = unary(number);
export const int   = parseInt;
export const float = parseFloat;

export function isNaN(n){
  return n !== n;
}

export function isNumber(n){
  return Number(n) === n;
}

export function isInteger(n){
  return Number(n) === n && n % 1 === 0;
}

export const isInt = isInteger;

export function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

export function mod(n, div){
  return n % div;
}

function min2(x, y){
  return IComparable.compare(x, y) < 0 ? x : y;
}

function max2(x, y){
  return IComparable.compare(x, y) > 0 ? x : y;
}

export const min = overload(null, identity, min2, reducing(min2));
export const max = overload(null, identity, max2, reducing(max2));

export function isZero(x){
  return x === 0;
}

export function isPos(x){
  return x > 0;
}

export function isNeg(x){
  return x < 0;
}

export function isOdd(n){
  return n % 2;
}

export const isEven = complement(isOdd);

export function clamp(self, min, max){
  return self < min ? min : self > max ? max : self;
}

function rand0(){
  return Math.random();
}

function rand1(n){
  return Math.random() * n;
}

export const rand = overload(rand0, rand1);

export function randInt(n){
  return Math.floor(rand(n));
}

export function sum(ns){
  return IReduce.reduce(ns, IAddable.add, 0);
}

export function least(ns){
  return IReduce.reduce(ns, min, Number.POSITIVE_INFINITY);
}

export function most(ns){
  return IReduce.reduce(ns, max, Number.NEGATIVE_INFINITY);
}

export function average(ns){
  return sum(ns) / ICounted.count(ns);
}

export function measure(ns){
  return {
    count: ICounted.count(ns),
    sum: sum(ns),
    least: least(ns),
    most: most(ns),
    average: average(ns)
  }
}