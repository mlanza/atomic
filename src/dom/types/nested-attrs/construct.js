import * as _ from "atomic/core";

export function NestedAttrs(element, key){
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

export const nestedAttrs = _.overload(null, nestedAttrs1, nestedAttrs2);
export const style = nestedAttrs1("style");
