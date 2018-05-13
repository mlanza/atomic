import {constantly, overload} from "../../core";
import {reducing} from "../../types/reduced";
import {EMPTY} from '../../types/empty';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

function cons2(head, tail){
  return new List(head, tail || EMPTY);
}

const _consN = reducing(cons2);

function consN(...args){
  return _consN.apply(this, args.concat([EMPTY]));
}

export const cons = overload(constantly(EMPTY), cons2, cons2, consN);

export default List;