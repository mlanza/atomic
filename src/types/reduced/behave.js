import {implement} from '../protocol';
import {effect} from '../../core';
import {IDeref} from '../../protocols';

function deref(self){
  return self.valueOf();
}

export default effect(
  implement(IDeref, {deref}));