import {overload, partial, doto, specify, identity, IDisposable} from "atomic/core";
import {pub} from "../../protocols/ipublish/concrete.js";
import {readonly} from "../../types/readonly/construct.js";
import {ISubscribe} from "./instance.js";

function into2(sink, source){
  return into3(sink, identity, source);
}

function into3(sink, xf, source){
  return into4(readonly, sink, xf, source);
}

function into4(decorate, sink, xf, source){
  const observer = partial(xf(pub), sink);
  ISubscribe.sub(source, observer);
  function dispose(_){
    ISubscribe.unsub(source, observer);
  }
  return doto(decorate(sink),
    specify(IDisposable, {dispose}));
}

function sub3(source, xf, sink){
  return ISubscribe.transducing(source, xf, sink);
}

function transducing(source, xf, sink){
  return into4(identity, sink, xf, source);
}

ISubscribe.transducing = transducing; //temporarily exposed to allow feature flag override

export const into = overload(null, null, into2, into3, into4);
export const sub = overload(null, null, ISubscribe.sub, sub3);
export const unsub = overload(null, null, ISubscribe.unsub);
export const subscribed = ISubscribe.subscribed;