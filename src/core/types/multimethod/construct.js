import {IFn, IEvented} from "../../protocols";
import {doto, partial, overload} from "../../core";
import {specify, forwardTo} from "../../types/protocol";
import {router} from "../../types/router/construct";
import {_ as v} from "param.macro";

function surrogate(f, substitute){
  return function(self, ...args){
    f.apply(null, [substitute].concat(args));
    return self;
  }
}

export default function Multimethod(router){
  this.router = router; //persistent
}

function multimethod0(){
  return multimethod1(null);
}

function multimethod1(fallback){
  return multimethod2(fallback, router);
}

function multimethod2(fallback, router){
  const instance = new Multimethod(router(fallback)),
        fn = partial(IFn.invoke, instance),
        on = surrogate(IEvented.on, instance),
        off = surrogate(IEvented.off, instance);
  return doto(fn,
    specify(IEvented, {on, off}));
}

export const multimethod = overload(multimethod0, multimethod1, multimethod2);