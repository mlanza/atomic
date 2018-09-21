import {ISequential, cons, satisfies} from 'cloe/core';
import {distinct} from "../set/concrete";

export default function Members(items){
  this.items = items;
}

export function members(self){
  return new Members(distinct(satisfies(ISequential, self) ? self : cons(self)));
}

export function emptyMembers(){
  return new Members();
}

Members.from = members;

export {Members};