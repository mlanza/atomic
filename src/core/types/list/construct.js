import {overload} from "../../core.js";
import {EmptyList, emptyList} from "../../types/empty-list.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

function from({head, tail}){
  return new List(head, tail);
}

function cons2(head, tail){
  return new List(head, tail || emptyList());
}

const _consN = p.reducing(cons2);

function consN(...args){
  return _consN.apply(this, args.concat([emptyList()]));
}

export const cons = overload(emptyList, cons2, cons2, consN);

List.prototype[Symbol.toStringTag] = "List";
List.from = from;

export function isList(self){
  return self && self.constructor === List || self.constructor === EmptyList;
}

export function list(...args){
  return p.reduce(function(memo, value){
    return cons(value, memo);
  }, emptyList(), args.reverse());
}
