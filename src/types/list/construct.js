import {constantly, overload} from "../../core";
import {reducing} from "../../types/reduced";
import EmptyList from '../../types/emptylist';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

function from({head, tail}){
  return new List(head, tail);
}

function cons2(head, tail){
  return new List(head, tail || EmptyList.EMPTY);
}

const _consN = reducing(cons2);

function consN(...args){
  return _consN.apply(this, args.concat([EmptyList.EMPTY]));
}

export const cons = overload(constantly(EmptyList.EMPTY), cons2, cons2, consN);

List.prototype[Symbol.toStringTag] = "List";
List.from = from;

export function isList(self){
  return self && self.constructor === List;
}

export default List;