import {constantly, overload} from '../../core';
import {set} from '../immutable-set/construct';

export default function Dict(attrs, empty){
  this.attrs = attrs;
  this.empty = empty;
}

function dict0(){
  return dict1({});
}

function dict1(attrs){
  return dict2(attrs, constantly(set()));
}

function dict2(attrs, empty){
  return new Dict(attrs || {}, empty);
}

export const dict = overload(dict0, dict1, dict2);