import {doto, conj, apply} from 'atomic/core';
import {_ as v} from "param.macro";

export function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return doto(new Middleware(handlers || []),
    apply(conj, v, handlers));
}