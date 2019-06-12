import {implement, get, blank, does, contains, IAppendable} from 'atomic/core';
import {ICheckable, IScope} from '../../protocols';
import {issue, issues} from '../issue';
import {and} from '../and/construct';
import {required} from './construct';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = get(obj, self.key);
  if (blank(found)) {
    return [issue(self, [self.key])];
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(v, self.key));
  }
}

function append(self, constraint){
  return required(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));