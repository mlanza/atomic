import {implement, get, blank, does, IAppendable} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {issue, issues} from '../issue';
import {and} from '../and/construct';
import {optional} from './construct';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = get(obj, self.key);
  if (blank(found)) {
    return null;
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(v, self.key));
  }
}

function append(self, constraint){
  return optional(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));