import {implement, does, constantly} from "cloe/core";
import {ICheckable} from '../../protocols';

function complaint(self){
  return self.message;
}

export default does(
  implement(ICheckable, {complaint, terminal: constantly(true)}));