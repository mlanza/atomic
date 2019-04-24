import {implement, does, map, compact, blot, IDeref} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {describe} from './construct';
import {_ as v} from "param.macro";

function deref(self){
  return self.constraint;
}

function check(self, value){
  return blot(map(function(iss){
    return issue(describe(self.desc, iss.constraint), iss.path);
  }, compact(ICheckable.check(self.constraint, value))));
}

export default does(
  implement(IDeref, {deref}),
  implement(ICheckable, {check}));