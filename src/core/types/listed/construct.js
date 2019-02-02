import {satisfies} from '../protocol';
import {ISequential} from '../../protocols';
import {cons} from '../list';

export default function Listed(items){
  this.items = items;
}

export function listed(self){
  return new Listed(self == null ? [] : satisfies(ISequential, self) ? self : cons(self));
}

export function emptyListed(){
  return new Listed([]);
}

Listed.from = listed;

export {Listed};