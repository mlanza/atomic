import {IAssociative} from '../../protocols';

export function accept(type){
  return function(state, command, next, raise){
    raise(IAssociative.assoc(command, "type", type));
    next(command);
  }
}