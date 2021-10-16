import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IPublish, ISubscribe} from "../../protocols.js";

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
  return p.sub(self.source, function(state){
    p.pub(observer, _.getIn(state, self.path));
  });
}

export default _.does(
  _.naming("Cursor"),
  //_.implement(_.IDisposable, {dispose}), TODO
  _.implement(_.IPath, {path}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReset, {reset}),
  _.implement(_.ISwap, {swap}),
  _.implement(ISubscribe, {sub}),
  _.implement(IPublish, {pub: reset}));
