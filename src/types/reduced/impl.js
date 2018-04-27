import {implement} from '../../protocol';
import {doto} from '../../core';
import Reduced from '../../types/reduced/construct';
import IDeref from '../../protocols/ideref';

function deref(self){
  return self.valueOf();
}

doto(Reduced,
  implement(IDeref, {deref: deref}));