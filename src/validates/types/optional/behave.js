import {implement, getIn, maybe, does} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, obj){
  var found = getIn(obj, self.path);
  if (found == null) {
    return null;
  } else {
    return maybe(ICheckable.check(self.test, found), _.mapa(function(f){
      return issue(f.what, self.path);
    }, v));
  }
}

export default does(
  implement(ICheckable, {check}));