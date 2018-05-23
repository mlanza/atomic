import {pipeline} from './construct';
import {effect} from '../../core';
import {implement} from '../protocol';
import {IFn, IAppendable, IPrependable} from '../../protocols';

export default function provideBehavior(piped){

  function append(self, f){
    return pipeline(self.how, IAppendable.append(self.fs, f));
  }

  function prepend(self, f){
    return pipeline(self.how, IPrependable.prepend(self.fs, f));
  }

  function invoke(self, ...args){
    return piped(self.how)(...self.fs)(...args);
  }

  return effect(
    implement(IFn, {invoke}),
    implement(IAppendable, {append}),
    implement(IPrependable, {prepend}));

}