import {doto} from '../../core';
import {conj} from "../../protocols/icollection/concrete";
import {apply} from "../function/concrete";
import {_ as v} from "param.macro";

export default function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return doto(new Middleware(handlers || []),
    apply(conj, v, handlers));
}