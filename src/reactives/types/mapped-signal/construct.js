import {weakMap, identity, overload, constantly, cons, repeat} from 'cloe/core';

export default function MappedSignal(emits, f, source, callbacks){
  this.emits = emits;
  this.f = f;
  this.source = source;
  this.callbacks = callbacks;
}

function changed(a, b){
  return a !== b;
}

export function readonly(source){ //prevents writing to source
  return map2(identity, source);
}

export function touched(source){
  return map3(cons(constantly(false), repeat(changed)), identity, source);
}

function map2(f, source){
  return map3(cons(constantly(true), repeat(changed)), f, source);
}

function map3(emits, f, source){
  return new MappedSignal(emits, f, source, weakMap());
}

export const map = overload(null, null, map2, map3);