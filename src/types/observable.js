import {detach} from '../core';
import {extend} from '../protocol';
import Deref from '../protocols/deref';
import Swap from '../protocols/swap';
import Reset from '../protocols/reset';
import Publish from '../protocols/publish';
import Subscribe from '../protocols/subscribe';
import Equiv from '../protocols/equiv';
import Publisher from '../types/publisher';

const _publisher = Symbol("publisher"),
      _validate = Symbol("validate"),
      _value = Symbol("value");

export function Observable(init, validate){
  this[_publisher] = new Publisher(),
  this[_value] = Object.freeze(init);
  this[_validate] = validate;
}

export function ValidatorError(obs, proposed){
  this.obs = obs;
  this.proposed = proposed;
  this.message = "Validator rejected reference state";
}

ValidatorError.prototype.toString = function(){
  return this.message;
}

function reset(self, val){
  var was = self[_value];
  if (was !== val) {
    const validate = self[_validate];
    if (!validate || validate(val)) {
      self[_value] = Object.freeze(val);
      Publish.publish(self[_publisher], val, was, self);
    } else {
      throw new ValidatorError(self, val);
    }
  }
}

function swap(self, f){
  reset(self, f(self[_value]));
}

function subscribe(self, callback){
  callback(self[_value], null, self); //initializing callback -- NOTE: atoms don't do this
  return Subscribe.subscribe(self[_publisher], callback);
}

function deref(self){
  return self[_value];
}

export function setValidator(self, validate){
  self[_validate] = validate;
}

export function observable(init, validate){
  return new Observable(init, validate);
}

export default extend(Observable, Subscribe, {
  subscribe: subscribe
}, Deref, {
  deref: deref
}, Swap, {
  swap: swap
}, Reset, {
  reset: reset
});