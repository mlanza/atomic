import {implement, does} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, text){
  return self.regex.test(text) ? null : [issue(self)];
}

export default does(
  implement(ICheckable, {check}));