import {constantly, overload, reducing} from "../../core";
import {EMPTY} from '../../types/empty';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

function cons2(head, tail){
  return new List(head, tail || EMPTY);
}

export const cons = overload(constantly(EMPTY), cons2, cons2, reducing(cons2));

export default List;