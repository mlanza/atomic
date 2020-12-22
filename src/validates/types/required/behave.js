import {implement, get, blank, does, contains, IAppendable} from 'atomic/core';
import {ICheckable, IScope} from '../../protocols';
import {issue, issues} from '../issue';
import {and} from '../and/construct';
import {required} from './construct';

function check(self, obj){
  const found = get(obj, self.key);
  if (blank(found)) {
    return [issue(self, [self.key])];
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(?, self.key));
  }
}

function append(self, constraint){
  return required(self.key, and(self.constraint, constraint));
}

export const behaveAsRequired = does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));