import {implement, get, maybe, does} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = get(obj, self.key);
  if (found == null) {
    return null;
  } else {
    return maybe(ICheckable.check(self.constraint, found), _.mapa(function(issue){
      return IScope.scope(issue, self.key);
    }, v));
  }
}

export default does(
  implement(ICheckable, {check}));