import {overload} from '../../core';

export default function NestedAttrs(element, key){
  this.element = element;
  this.key = key;
}

function nestedattrs2(element, key){
  return new NestedAttrs(element, key);
}

function nestedattrs1(key){
  return function(element){
    return nestedattrs2(element, key);
  }
}

export const nestedattrs = overload(null, nestedattrs1, nestedattrs2);
export const style = nestedattrs1("style");