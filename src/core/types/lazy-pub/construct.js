import {publisher} from "../publisher/construct";
import {isFunction} from "../function/construct";
import {once, noop, partial, overload, identity} from '../../core';
import {IPublish, ISubscribe} from '../../protocols';

export default function LazyPublication(sink, activate, deactivate){
  this.sink = sink;
  this.activate = activate;
  this.deactivate = deactivate;
}

function lazyPub1(callback){
  const sink = publisher(),
        {activate, deactivate} = callback(sink);
  return new LazyPublication(sink, activate, deactivate);
}

function lazyPub2(sink, source){
  return lazyPub3(sink, identity, source);
}

function lazyPub3(sink, xf, source){
  const callback = partial(xf(IPublish.pub), sink);
  return new LazyPublication(sink, function(){
    ISubscribe.sub(source, callback);
  }, function(){
    ISubscribe.unsub(source, callback);
  });
}

export const lazyPub = overload(null, lazyPub1, lazyPub2, lazyPub3);