import {doto} from '../../core';
import {implement} from '../../protocol';
import IShow from '../../protocols/ishow';

function show(self){
  return self.toString();
}

doto(Number,
  implement(IShow, {show: show}));