import {implement, does, apply, IPath, IPublish, ISubscribe, IReset, ISwap, IDeref, IDisposable, IDispatch, ICounted} from 'cloe/core';
import * as _ from "cloe/core";

function path(self){
  return self.path;
}

function deref(self){
  return _.getIn(_.deref(self.source), self.path);
}

function reset(self, value){
  _.swap(self.source, function(state){
    return _.assocIn(state, self.path, value);
  });
}

function swap(self, f){
  _.swap(self.source, function(state){
    return _.updateIn(state, self.path, f);
  });
}

function sub(self, callback){
  function cb(state){
    callback(_.getIn(state, self.path));
  }
  self.callbacks.set(callback, cb);
  _.sub(self.source, cb);
}

function unsub(self, callback){
  const cb = self.callbacks.get(callback);
  _.unsub(self.source, cb);
  cb && self.callbacks.delete(callback);
}

function subscribed(self){
  return ICounted.count(self.callbacks);
}

function dispatch(self, command){
  IDispatch.dispatch(self.source, _.update(command, "path", function(path){
    return apply(_.conj, self.path, path || []);
  }));
}

export default does(
  //implement(IDisposable, {dispose}), TODO
  implement(IPath, {path}),
  implement(IDispatch, {dispatch}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));