import {implement, does, isString} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, obj){
  try {
    const value = isString(obj) ? self.parse(obj) : obj;
    return ICheckable.check(self.constraint, value);
  } catch (ex) {
    return [issue(self)];
  }
}

export default does(
  implement(ICheckable, {check}));