import {implement} from '../protocol';
import {effect, once, noop} from '../../core';
import {IPublish, ISubscribe, IDisposable, ICounted, IDeref} from '../../protocols';

function sub(self, callback){
  const activated = ICounted.count(self.sink.subscribers) === 0;
  activated && (self.deactivate = once(self.activate(self.sink)));
  const unsub = ISubscribe.sub(self.sink, callback);
  return once(function(){
      unsub();
      const deactivated = ICounted.count(self.sink.subscribers) === 0;
      deactivated && self.deactivate(self.sink);
  });
}

function dispose(self){
  self.deactivate(self.sink);
}

function deref(self){
  const activated = ICounted.count(self.sink.subscribers) === 0;
  activated && sub(self, noop)(); //force state update
  return IDeref.deref(self.sink);
}

export default effect(
  implement(IDeref, {deref}),
  implement(IDisposable, {dispose}),
  implement(ISubscribe, {sub}));