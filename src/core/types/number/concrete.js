import {overload, identity, constantly} from "../../core";
import {IReduce, ICounted} from "../../protocols";
import {complement, partial, unary} from "../function";
import {reducing} from "../../api/reduce";

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

function plus2(x, y){
  return x + y;
}

function minus1(x){
  return minus2(0, x);
}

function minus2(x, y){
  return x - y;
}

function multiply2(x, y){
  return x * y;
}

function divide1(x){
  return divide2(1, x);
}

function divide2(x, y){
  return x / y;
}

export const plus     = overload(constantly(0), identity, plus2, reducing(plus2));
export const minus    = overload(constantly(0), minus1, minus2, reducing(minus2));
export const multiply = overload(constantly(1), identity, multiply2, reducing(multiply2));
export const divide   = overload(null, divide1, divide2, reducing(divide2));
export const inc      = partial(plus2, +1);
export const dec      = partial(plus2, -1);

function min2(x, y){
  return x < y ? x : y;
}

function max2(x, y){
  return x > y ? x : y;
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

export const isEven  = complement(isOdd);

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
  return IReduce.reduce(ns, plus, 0);
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