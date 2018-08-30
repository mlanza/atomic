import {implement} from '../protocol';
import {does, constantly} from '../../core';
import {ICheckable} from '../../protocols';

function complaint(self){
  return self.message;
}

export default does(
  implement(ICheckable, {complaint, terminal: constantly(true)}));