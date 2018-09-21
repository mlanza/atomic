import {weakMap, identity, overload} from 'cloe/core';

export default function MappedSignal(pred, f, source, callbacks){
  this.pred = pred;
  this.f = f;
  this.source = source;
  this.callbacks = callbacks;
}

//you might do this to create a readonly signal from an observable
function map1(source){
  return map2(identity, source);
}

function map2(f, source){
  return map3(function(a, b){
    return a !== b;
  }, f, source);
}

function map3(pred, f, source){
  return new MappedSignal(pred, f, source, weakMap());
}

export const map = overload(null, map1, map2, map3);