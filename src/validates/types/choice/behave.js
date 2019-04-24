import {implement, does, constantly, includes} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, text){
  return includes(self.options, text) ? null : [issue(self)];
}

export default does(
  implement(ICheckable, {check}));