import {effect} from '../../core';
import {implement} from '../../protocol';
import {IFn} from '../../protocols';

function invoke(self, ...args){
  return self.apply(null, args);
}

export default effect(
  implement(IFn, {invoke: invoke}));