import {doto} from '../../core';
import {implement} from '../../protocol';
import IShow from '../../protocols/ishow';

function show(self){
  return "\"" + self.toISOString() + "\"";
}

doto(Date,
  implement(IShow, {show: show}));