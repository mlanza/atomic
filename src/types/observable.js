import {detach} from '../core';
import {extend} from '../protocol';
import Deref from '../protocols/deref';
import Swap from '../protocols/swap';
import Reset from '../protocols/reset';
import Subscribe from '../protocols/subscribe';
import Publisher from '../types/publisher';

const _publisher = Symbol("publisher"),
      _value = Symbol("value");

export function Observable(init){
  this[_publisher] = new Publisher(),
  this[_value] = Object.freeze(init);
}

function reset(val){
  if (this[_value] !== val) {
    this[_value] = Object.freeze(val);
    this[_publisher].publish(val);
  }
}

function swap(f){
  this.reset(f(this[_value]));
}

function subscribe(callback){
  callback(this[_value]); //initializing callback
  return this[_publisher].subscribe(callback);
}

function deref(){
  return this[_value];
}

Object.assign(Observable.prototype, {reset, swap, subscribe, deref});

export function observable(init){
  return new Observable(init);
}

export default extend(Observable, Subscribe, {
  subscribe: detach(subscribe)
}, Deref, {
  deref: detach(deref)
}, Swap, {
  swap: detach(swap)
}, Reset, {
  reset: detach(reset)
});