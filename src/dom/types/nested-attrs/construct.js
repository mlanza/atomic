import {overload} from 'cloe/core';

export default function NestedAttrs(element, key){
  this.element = element;
  this.key = key;
}

function nestedAttrs2(element, key){
  return new NestedAttrs(element, key);
}

function nestedAttrs1(key){
  return function(element){
    return nestedAttrs2(element, key);
  }
}

export const nestedAttrs = overload(null, nestedAttrs1, nestedAttrs2);
export const style = nestedAttrs1("style");