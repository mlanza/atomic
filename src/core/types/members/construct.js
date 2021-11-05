import {constructs, comp} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import {sequential} from "../../protocols/isequential/concrete";

export function Members(items, f){
  this.items = items;
  this.f = f;
}

export function members(f){
  const g = comp(f, sequential);
  return thrush(function construct(items){
    return new Members(g(items), g);
  });
}
