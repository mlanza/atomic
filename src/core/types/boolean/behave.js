import {does, identity} from '../../core';
import {implement} from '../protocol';
import {IInverse, IComparable} from '../../protocols';

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function inverse(self){
  return !self;
}

export const behaveAsBoolean = does(
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}));