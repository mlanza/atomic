import {implement, does, cons, toArray, assoc, IDeref} from 'atomic/core';
import {IScope} from '../../protocols';
import {issue} from './construct';

function deref(self){
  return self.constraint;
}

function scope(self, key) {
  return issue(self.constraint, toArray(cons(key, self.path)));
}

function at(self, path){
  return issue(self.constraint, path);
}

export default does(
  implement(IDeref, {deref}),
  implement(IScope, {scope, at}));