import {implement, does, conj} from 'cloe/core';
import {IScope} from '../../protocols';
import {issue} from './construct';

function scope(self, key) {
  return issue(self.constraint, conj(self.path || [], key));
}

function at(self, path){
  return issue(self.constraint, path);
}

export default does(
  implement(IScope, {scope, at}));