import {implement} from '../../protocol';
import {juxt} from '../../core';
import IDeref from '../../protocols/ideref';

function deref(self){
  return self.valueOf();
}

export default juxt(
  implement(IDeref, {deref: deref}));