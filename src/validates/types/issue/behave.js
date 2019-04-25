import {implement, does, conj, assoc, IDeref} from 'cloe/core';
import {IScope} from '../../protocols';
import {issue} from './construct';

function deref(self){
  return self.constraint;
}

function scope(self, key) {
  return issue(self.constraint, conj(self.path || [], key));
}

function at(self, path){
  return issue(self.constraint, path);
}

export default does(
  implement(IDeref, {deref}),
  implement(IScope, {scope, at}));