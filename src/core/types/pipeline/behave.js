import {effect} from '../../core';
import {implement} from '../protocol';
import {isFunction} from '../function/construct';
import {filter} from '../lazy-seq/concrete';
import {IFn, IReduce, ISeq, IFunctor, IAppendable, IPrependable, IInsertable} from '../../protocols';

function append(self, f){
  return self.constructor.from(IAppendable.append(self.fs, f));
}

function prepend(self, f){
  return self.constructor.from(IPrependable.prepend(self.fs, f));
}

function invoke(self, ...args){
  const fs = filter(isFunction, self.fs), //we may insert non-fns purely for relative positioning via IInsertable.
        f  = ISeq.first(fs);
  return IReduce.reduce(ISeq.rest(fs), IFunctor.fmap, f(...args));
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