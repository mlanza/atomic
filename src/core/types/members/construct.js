import {ISeqable, isSequential} from '../../protocols';
import {distinct, compact} from "../lazyseq/concrete";

export default function Members(items){
  this.items = items;
}

export function members(self){
  return new Members(distinct(compact(isSequential(self) ? self : [self])));
}

Members.from = members;
Members.EMPTY = new Members();

export {Members};