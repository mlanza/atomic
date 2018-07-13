import {complement, overload} from '../../core';
import {IEquiv} from '../../protocols';

export default function MappedSignal(pred, f, source){
  this.pred = pred;
  this.f = f;
  this.source = source;
}

function mappedSignal2(f, source){
  return mappedSignal3(complement(IEquiv.equiv), f, source);
}

function mappedSignal3(pred, f, source){
  return new MappedSignal(pred, f, source);
}

export const mappedSignal = overload(null, null, mappedSignal2, mappedSignal3);