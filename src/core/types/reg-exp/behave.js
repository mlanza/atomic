import {implement} from '../protocol';
import {does} from '../../core';
import {ICheckable} from '../../protocols';

function check(self, text){
  return self.test(text);
}

function complaint(self){
  return "must match the pattern";
}

export default does(
  implement(ICheckable, {check, complaint}));