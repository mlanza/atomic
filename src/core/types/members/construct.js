import {ISequential} from "../../protocols/isequential/instance.js";
import {satisfies} from "../protocol.js";
import {cons} from "../../types/list/construct.js";

export function Members(items, f){
  this.items = items;
  this.f = f;
}

export function members(items, f){
  return new Members(f(satisfies(ISequential, items) ? items : cons(items)), f);
}
