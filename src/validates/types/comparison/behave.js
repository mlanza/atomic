import {implement, does} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, value){
  return self.f(value, self.other) ? null : [issue(self)];
}

export default does(
  implement(ICheckable, {check}));