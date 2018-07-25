import {implement} from '../protocol';
import {effect} from '../../core';
import {IPublish, ISubscribe, IReset, ISwap, IDeref, IDisposable, IDispatch} from '../../protocols';
import {apply} from "../../types/function/concrete";
import * as icollection from "../../protocols/icollection/concrete";
import * as ideref from '../../protocols/ideref/concrete';
import * as ilookup from '../../protocols/ilookup/concrete';
import * as iassociative from '../../protocols/iassociative/concrete';
import * as isubscribe from '../../protocols/isubscribe/concrete';
import * as iswap from '../../protocols/iswap/concrete';

function deref(self){
  return ilookup.getIn(ideref.deref(self.source), self.path);
}

function reset(self, value){
  return iswap.swap(self.source, function(state){
    return iassociative.assocIn(state, self.path, value);
  });
}

function swap(self, f){
  return iswap.swap(self.source, function(state){
    return iassociative.updateIn(state, self.path, f);
  });
}

function sub(self, callback){
  return isubscribe.sub(self.source, function(state){
    callback(ilookup.getIn(state, self.path));
  });
}

function dispatch(self, command){
  IDispatch.dispatch(self.source, iassociative.update(command, "path", function(path){
    return apply(icollection.conj, path || [], self.path);
  }));
}

export default effect(
  //implement(IDisposable, {dispose}), TODO
  implement(IDispatch, {dispatch}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));