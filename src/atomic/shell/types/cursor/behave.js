import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ISwappable, IResettable, IPublish, ISubscribe} from "../../protocols.js";

function path(self){
  return typeof self.path === "function" ? self.path.call(self) : self.path;
}

function deref(self){
  return _.getIn(_.deref(self.source), path(self));
}

function reset(self, value){
  p.swap(self.source, function(state){
    return _.assocIn(state, path(self), value);
  });
}

function swap(self, f){
  p.swap(self.source, function(state){
    return _.updateIn(_, path(self), f);
  });
}

function sub(self, observer){
  return p.sub(self.source, function(state){
    p.pub(observer, _.getIn(state, path(self)));
  });
}

export default _.does(
  _.keying("Cursor"),
  //_.implement(_.IDisposable, {dispose}), TODO
  _.implement(_.IPath, {path}),
  _.implement(_.IDeref, {deref}),
  _.implement(IResettable, {reset}),
  _.implement(ISwappable, {swap}),
  _.implement(ISubscribe, {sub}),
  _.implement(IPublish, {pub: reset}));
