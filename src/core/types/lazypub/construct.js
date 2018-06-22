import {publisher} from "../publisher/construct";
import {isFunction} from "../function/construct";
import {once, noop, partial, overload, identity} from '../../core';
import {IPublish, ISubscribe} from '../../protocols';

export default function LazyPublication(sink, activate, deactivate){
  this.sink = sink;
  this.activate = activate;
  this.deactivate = deactivate;
}

function lazyPub1(source){
  return lazyPub2(publisher(), source);
}

function lazyPub2(sink, source){
  return lazyPub3(sink, identity, source);
}

function lazyPub3(sink, xf, source){
  const callback = partial(xf(IPublish.pub), sink);
  return new LazyPublication(sink, isFunction(source) ? source : function(sink){
    return ISubscribe.sub(source, callback);
  }, noop);
}

export const lazyPub = overload(null, lazyPub1, lazyPub2, lazyPub3);