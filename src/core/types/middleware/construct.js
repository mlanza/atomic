import {doto} from '../../core';
import {push} from "../../protocols/ipush/concrete";
import {apply} from "../function/concrete";
import {_ as v} from "param.macro";

export default function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return doto(new Middleware(handlers || []),
    apply(push, v, handlers));
}