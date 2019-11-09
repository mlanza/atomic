import {implement} from '../protocol';
import {does} from '../../core';
import {IDeref} from '../../protocols';

function deref(self){
  return self.valueOf();
}

export const behaveAsReduced = does(
  implement(IDeref, {deref}));