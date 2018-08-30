import {implement} from '../protocol';
import {does, constantly} from '../../core';
import {ICheckable} from '../../protocols';

function check(self, text){
  return text != null && (!text.trim || text.trim().length > 0);
}

function complaint(self){
  return "required";
}

export default does(
  implement(ICheckable, {check, complaint, terminal: constantly(true)}));