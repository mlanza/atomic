import {implement, does, map, compact, blot, IDeref} from 'cloe/core';
import {ICheckable, IExplains} from '../../protocols';
import {issue} from '../issue';
import {anno} from './construct';
import {_ as v} from "param.macro";

function deref(self){
  return self.constraint;
}

function explain(self){
  return self.note;
}

function check(self, value){
  return blot(map(function(iss){
    return issue(anno(self.note, iss.constraint), iss.path);
  }, compact(ICheckable.check(self.constraint, value))));
}

export default does(
  implement(IDeref, {deref}),
  implement(IExplains, {explain}),
  implement(ICheckable, {check}));