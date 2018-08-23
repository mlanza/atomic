import {complement, identity, overload} from '../../core';
import {IEquiv} from '../../protocols';
import {weakMap} from "../weak-map/construct";

export default function MappedSignal(pred, f, source, callbacks){
  this.pred = pred;
  this.f = f;
  this.source = source;
  this.callbacks = callbacks;
}

//you might do this to create a readonly signal from an observable
function mappedSignal1(source){
  return mappedSignal2(identity, source);
}

function mappedSignal2(f, source){
  return mappedSignal3(function(a, b){
    return a !== b;
  }, f, source);
}

function mappedSignal3(pred, f, source){
  return new MappedSignal(pred, f, source, weakMap());
}

export const mappedSignal = overload(null, mappedSignal1, mappedSignal2, mappedSignal3);