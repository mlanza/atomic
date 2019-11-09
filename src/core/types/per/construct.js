import {satisfies} from '../protocol';
import {overload, partial} from '../../core';
import {ISequential} from '../../protocols';
import {cons} from '../list';
import {thrush} from '../../protocols/ifunctor/concrete';

export function Per(items){
  this.items = items;
}

function per1(self){
  return new Per(self == null ? [] : satisfies(ISequential, self) ? self : cons(self));
}

export const per = overload(null, per1, partial(thrush, per1));

export function emptyPer(){
  return new Per([]);
}

Per.from = per;