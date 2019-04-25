import {implement, does} from 'cloe/core';
import {ICheckable} from '../../protocols';

function check(self, obj){
  return self.pred(obj) ? ICheckable.check(self.constraint, obj) : null;
}

export default does(
  implement(ICheckable, {check}));