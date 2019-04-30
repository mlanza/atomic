import {implement, get, maybe, map, does, IAppendable} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {issue} from '../issue';
import {and} from '../and/construct';
import {required} from './construct';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = get(obj, self.key);
  if (found == null) {
    return [issue(self, [self.key])];
  } else {
    return maybe(ICheckable.check(self.constraint, found), map(function(issue){
      return IScope.scope(issue, self.key);
    }, v));
  }
}

function append(self, constraint){
  return required(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));