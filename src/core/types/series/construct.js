import {doto, overload} from "../../core.js";
import {constructs} from "../../types/function.js";
import iseries from "./behave.js";

function extend(Type){
  iseries(Type);
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
