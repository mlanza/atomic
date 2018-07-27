import {effect} from '../../core';
import {implement} from '../protocol';
import {IFn, IReduce, ISeq, IFunctor, IAppendable, IPrependable, IInsertable} from '../../protocols';

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

function before(self, reference, inserted){
  return self.constructor.from(IInsertable.before(self.fs, reference, inserted));
}

function after(self, reference, inserted){
  return self.constructor.from(IInsertable.after(self.fs, reference, inserted));
}

export default effect(
  implement(IFn, {invoke}),
  implement(IInsertable, {before, after}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}));