import {effect} from '../../core';
import {implement} from '../protocol';
import {IFn, IReduce, ISeq, IFunctor, IAppendable, IPrependable} from '../../protocols';

function append(self, f){
  return self.constructor.from(IAppendable.append(self.fs, f));
}

function prepend(self, f){
  return self.constructor.from(IPrependable.prepend(self.fs, f));
}

function invoke(self, ...args){
  const f = ISeq.first(self.fs);
  return IReduce.reduce(ISeq.rest(self.fs), IFunctor.fmap, f(...args));
}

export default effect(
  implement(IFn, {invoke}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}));