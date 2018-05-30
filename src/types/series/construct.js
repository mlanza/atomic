import {doto, overload} from '../../core';
import {constructs} from '../../types/function';
import behave from "./behave";

function extend(Type){
  behave(Type);
  Type.create = constructs(Type);
  Type.from = function(items){
    return Object.assign(Object.create(Type.prototype), {items: items});
  }
}

export function series(){
  return doto(function Series(items){
    this.items = items;
  }, extend);
}
