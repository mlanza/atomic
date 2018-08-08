import {constantly, overload} from '../../core';
import {set} from '../immutable-set/construct';

export default function MultiDict(attrs, empty){
  this.attrs = attrs;
  this.empty = empty;
}

function multidict0(){
  return multidict1({});
}

function multidict1(attrs){
  return multidict2(attrs, constantly(set()));
}

function multidict2(attrs, empty){
  return new MultiDict(attrs || {}, empty);
}

export const multidict = overload(multidict0, multidict1, multidict2);