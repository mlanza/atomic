import {constantly, overload} from "../../core";
import {apply} from "../../types/function/concrete";
import {reducing} from "../../api/reduce";
import EmptyList from '../../types/emptylist';
import {IReduce} from '../../protocols/ireduce';

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
  return self && self.constructor === List || self.constructor === EmptyList;
}

export function list(...args){
  return IReduce.reduce(args.reverse(), function(memo, value){
    return cons(value, memo);
  }, EmptyList.EMPTY);
}

export default List;