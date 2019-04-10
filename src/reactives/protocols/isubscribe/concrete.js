import {overload, partial, doto, specify, identity, IDisposable} from "cloe/core";
import {pub} from "../../protocols/ipublish/concrete";
import {readonly} from "../../types/readonly/construct";
import ISubscribe from "./instance";

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
  return into4(identity, sink, xf, source);
}

export const into = overload(null, null, into2, into3, into4);
export const sub = overload(null, null, ISubscribe.sub, sub3);
export const unsub = overload(null, null, ISubscribe.unsub);
export const subscribed = ISubscribe.subscribed;