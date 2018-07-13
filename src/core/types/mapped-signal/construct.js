import {complement, identity, overload} from '../../core';
import {IEquiv} from '../../protocols';

export default function MappedSignal(pred, f, source){
  this.pred = pred;
  this.f = f;
  this.source = source;
}

//you might do this to create a readonly signal from an observable
function mappedSignal1(source){
  return mappedSignal2(identity, source);
}

function mappedSignal2(f, source){
  return mappedSignal3(complement(IEquiv.equiv), f, source);
}

function mappedSignal3(pred, f, source){
  return new MappedSignal(pred, f, source);
}

export const mappedSignal = overload(null, mappedSignal1, mappedSignal2, mappedSignal3);