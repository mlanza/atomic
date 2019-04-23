import {implement, getIn, maybe, does} from 'cloe/core';
import {ICheckable, IScope} from '../../protocols';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = getIn(obj, self.path);
  if (found == null) {
    return null;
  } else {
    return maybe(ICheckable.check(self.constraint, found), _.mapa(function(issue){
      return IScope.at(issue, self.path);
    }, v));
  }
}

export default does(
  implement(ICheckable, {check}));