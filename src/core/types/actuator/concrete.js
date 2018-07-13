import {IAssociative} from '../../protocols';

export function accept(type){
  return function(state, command, next){
    next(IAssociative.assoc(command, "type", type));
  }
}