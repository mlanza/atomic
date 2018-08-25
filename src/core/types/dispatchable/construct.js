import {overload} from "../../core";

export default function Dispatchable(fallback, handlers){
  this.fallback = fallback;
  this.handlers = handlers;
}

function dispatchable2(fallback, handlers){
  return new Dispatchable(fallback, handlers);
}

function dispatchable1(fallback){
  return dispatchable2(fallback, []);
}

function dispatchable0(){
  return dispatchable1(null);
}

export const dispatchable = overload(dispatchable0, dispatchable1, dispatchable2);

Dispatchable.from = dispatchable;