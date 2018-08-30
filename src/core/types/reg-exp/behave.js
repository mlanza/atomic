import {implement} from '../protocol';
import {does} from '../../core';
import {ICheckable, IMatch} from '../../protocols';

function matches(self, text){
  return self.test(text);
}

const check = matches;

function complaint(self){
  return "must match the pattern";
}

export default does(
  implement(IMatch, {matches}),
  implement(ICheckable, {check, complaint}));