import {slice, constantly, overload, reducing} from "../../core";
import {EMPTY} from '../../types/empty';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

function cons2(head, tail){
  return new List(head, tail || EMPTY);
}

const _consN = reducing(cons2);

function consN(){
  return _consN.apply(this, slice(arguments).concat([EMPTY]));
}

export const cons = overload(constantly(EMPTY), cons2, cons2, consN);

export default List;