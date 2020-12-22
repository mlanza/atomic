import {doto, conj, apply} from 'atomic/core';

export function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return doto(new Middleware(handlers || []),
    apply(conj, ?, handlers));
}