import * as _ from "atomic/core";
import {pub} from "../../protocols/ipublish/concrete.js";
import {readonly} from "../../types/readonly/construct.js";
import {ISubscribe} from "./instance.js";

function into2(sink, source){
  return into3(sink, _.identity, source);
}

function into3(sink, xf, source){
  return into4(readonly, sink, xf, source);
}

function into4(decorate, sink, xf, source){
  const observer = _.partial(xf(pub), sink);
  ISubscribe.sub(source, observer);
  function dispose(_){
    ISubscribe.unsub(source, observer);
  }
  return _.doto(decorate(sink),
    _.specify(_.IDisposable, {dispose}));
}

function sub3(source, xf, sink){
  return ISubscribe.transducing(source, xf, sink);
}

function subN(source){
  const sink = arguments[arguments.length - 1],
        xfs = _.slice(arguments, 1, arguments.length - 1);
  return sub3(source, _.comp(...xfs), sink);
}

function transducing(source, xf, sink){
  return into4(_.identity, sink, xf, source);
}

ISubscribe.transducing = transducing; //temporarily exposed to allow feature flag override

export const into = _.overload(null, null, into2, into3, into4);
export const sub = _.overload(null, null, ISubscribe.sub, sub3, subN);
export const unsub = _.overload(null, null, ISubscribe.unsub);
export const subscribed = ISubscribe.subscribed;
