import {doto, overload} from '../../core';
import {constructs} from '../../types/function';
import {behaveAsSeries} from "./behave";

function extend(Type){
  behaveAsSeries(Type);
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
