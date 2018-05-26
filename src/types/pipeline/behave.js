import {pipeline} from './construct';
import {piped} from './concrete';
import {effect} from '../../core';
import {implement} from '../protocol';
import {IFn, IAppendable, IPrependable} from '../../protocols';

function append(self, f){
  return pipeline(self.how, IAppendable.append(self.fs, f));
}

function prepend(self, f){
  return pipeline(self.how, IPrependable.prepend(self.fs, f));
}

function invoke(self, ...args){
  return piped(self.how)(...self.fs)(...args);
}

export default effect(
  implement(IFn, {invoke}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}));