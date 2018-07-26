import {ISequential} from '../../protocols';
import {distinct, compact} from "../lazy-seq/concrete";
import {cons} from "../list/construct";
import {satisfies} from "../protocol/concrete";

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