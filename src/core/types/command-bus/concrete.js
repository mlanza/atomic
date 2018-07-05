import {IAssociative} from '../../protocols';

export function accept(type){
  return function(state, command){
    return [IAssociative.assoc(command, "type", type)];
  }
}