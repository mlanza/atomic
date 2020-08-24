import {Symbol} from '../symbol/construct';

export function EmptyList(){
}

export function emptyList(){
  return new EmptyList();
}

EmptyList.prototype[Symbol.toStringTag] = "EmptyList";
EmptyList.create = emptyList;
