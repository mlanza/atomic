import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IPublish, ISubscribe, IDispatch} from "../../protocols.js";

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

function sub(self, observer){
  function observe(state){
    p.pub(observer, _.getIn(state, self.path));
  }
  self.callbacks.set(observer, observe);
  p.sub(self.source, observe);
}

function unsub(self, observer){
  const observe = self.callbacks.get(observer);
  p.unsub(self.source, observe);
  observe && self.callbacks.delete(observer);
}

function subscribed(self){
  return _.count(self.callbacks);
}

function dispatch(self, command){
  p.dispatch(self.source, _.update(command, "path", function(path){
    return _.apply(_.conj, self.path, path || []);
  }));
}

export default _.does(
  //_.implement(_.IDisposable, {dispose}), TODO
  _.implement(_.IPath, {path}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReset, {reset}),
  _.implement(_.ISwap, {swap}),
  _.implement(IDispatch, {dispatch}),
  _.implement(ISubscribe, {sub, unsub, subscribed}),
  _.implement(IPublish, {pub: reset}));
