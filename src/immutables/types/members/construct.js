import {ISequential, cons, satisfies} from "atomic/core";
import {distinct} from "../set/concrete.js";

export function Members(items){
  this.items = items;
}

export function members(self){
  return new Members(distinct(satisfies(ISequential, self) ? self : cons(self)));
}

export function emptyMembers(){
  return new Members();
}
