import {implement} from '../../protocol';
import {doto} from '../../core';
import Observable from '../../types/observable/construct';
import IPublish from '../../protocols/ipublish';
import ISubscribe from '../../protocols/isubscribe';
import IReset from '../../protocols/ireset';
import ISwap from '../../protocols/iswap';
import IDeref from '../../protocols/ideref';

function deref(self){
  return self.state;
}

function reset(self, value){
  if (value !== self.state){
    self.state = value;
    IPublish.pub(self.publisher, value);
  }
  return self.state;
}

function _swap(self, f){
  return reset(self, f(self.state));
}

function sub(self, callback){
  callback(this.state);
  return ISubscribe.sub(self.publisher, callback);
}

doto(Observable,
  implement(IDeref, {deref: deref}),
  implement(ISubscribe, {sub: sub}),
  implement(IReset, {reset: reset}),
  implement(ISwap, {_swap: _swap}));