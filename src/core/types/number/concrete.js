import {overload, identity, constantly, complement} from "../../core.js";
import {IReduce, ICounted, IComparable, IAddable} from "../../protocols.js";
import {partial, unary} from "../function.js";
import * as p from "./protocols.js";

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
  return p.compare(x, y) < 0 ? x : y;
}

function max2(x, y){
  return p.compare(x, y) > 0 ? x : y;
}

export const min = overload(null, identity, min2, p.reducing(min2));
export const max = overload(null, identity, max2, p.reducing(max2));

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
  return p.reduce(p.add, 0, ns);
}

export function least(ns){
  return p.reduce(min, Number.POSITIVE_INFINITY, ns);
}

export function most(ns){
  return p.reduce(max, Number.NEGATIVE_INFINITY, ns);
}

export function average(ns){
  return sum(ns) / p.count(ns);
}

export function measure(ns){
  return {
    count: p.count(ns),
    sum: sum(ns),
    least: least(ns),
    most: most(ns),
    average: average(ns)
  }
}
