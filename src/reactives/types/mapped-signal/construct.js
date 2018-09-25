import {weakMap, identity, overload} from 'cloe/core';

export default function MappedSignal(pred, f, source, callbacks){
  this.pred = pred;
  this.f = f;
  this.source = source;
  this.callbacks = callbacks;
}

//you might do this to create a readonly signal from an observable
function mapped1(source){
  return mapped2(identity, source);
}

function mapped2(f, source){
  return mapped3(function(a, b){
    return a !== b;
  }, f, source);
}

function mapped3(pred, f, source){
  return new MappedSignal(pred, f, source, weakMap());
}

export const mapped = overload(null, mapped1, mapped2, mapped3);