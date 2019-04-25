import {implement, get, maybe, map, does} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {issue} from '../issue';
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

export default does(
  implement(ICheckable, {check}));