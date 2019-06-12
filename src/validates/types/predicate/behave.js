import {implement, does, assoc, apply, indexOf} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, obj){
  const pos = indexOf(self.args, null),
        args = assoc(self.args, pos, obj);
  return apply(self.f, args) ? null : [issue(self)];
}

export default does(
  implement(ICheckable, {check}));