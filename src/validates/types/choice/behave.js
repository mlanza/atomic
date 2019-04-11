import {implement, does, constantly, includes} from 'cloe/core';
import {ICheckable} from '../../protocols';

function check(self, text){
  return includes(self.options, text);
}

export default does(
  implement(ICheckable, {check, terminal: constantly(true)}));