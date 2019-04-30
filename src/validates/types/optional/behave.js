import {implement, get, maybe, mapa, does, IAppendable} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {and} from '../and/construct';
import {optional} from './construct';

import {_ as v} from "param.macro";

function check(self, obj){
  var found = get(obj, self.key);
  if (found == null) {
    return null;
  } else {
    return maybe(ICheckable.check(self.constraint, found), mapa(function(issue){
      return IScope.scope(issue, self.key);
    }, v));
  }
}

function append(self, constraint){
  return optional(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));