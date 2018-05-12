import {implement} from '../../protocol';
import {juxt} from '../../core';
import IPublish from '../../protocols/ipublish';
import ISubscribe from '../../protocols/isubscribe';
import IReset from '../../protocols/ireset';
import ISwap from '../../protocols/iswap';
import IDeref from '../../protocols/ideref';
import IDisposable from '../../protocols/idisposable';

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
  callback(self.state);
  return ISubscribe.sub(self.publisher, callback);
}

export default juxt(
  implement(IDeref, {deref: deref}),
  implement(ISubscribe, {sub: sub}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset: reset}),
  implement(ISwap, {_swap: _swap}));