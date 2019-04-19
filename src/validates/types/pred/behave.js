import {implement, does, count, maybe, Array} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, value){
  return self.pred(value) ? null : [issue(self)];
}

export default does(
  implement(ICheckable, {check}));