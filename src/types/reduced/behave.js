import {implement} from '../../protocol';
import {effect} from '../../core';
import IDeref from '../../protocols/ideref';

function deref(self){
  return self.valueOf();
}

export default effect(
  implement(IDeref, {deref: deref}));