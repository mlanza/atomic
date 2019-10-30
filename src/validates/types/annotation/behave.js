import {implement, does, IDeref, IAppendable} from 'atomic/core';
import {ICheckable, IExplains} from '../../protocols';
import {issue, issues} from '../issue';
import {anno} from './construct';
import {_ as v} from "param.macro";

function deref(self){
  return self.constraint;
}

function explain(self){
  return self.note;
}

function check(self, value){
  return issues(ICheckable.check(self.constraint, value), function(iss){
    return issue(anno(self.note, iss.constraint), iss.path);
  });
}

function append(self, constraint){
  return anno(self.note, IAppendable.append(self.constraint, constraint));
}

export default does(
  implement(IDeref, {deref}),
  implement(IExplains, {explain}),
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));