import {implement} from '../protocol';
import {does} from '../../core';
import {IMatchable} from '../../protocols';

function matches(self, text){
  return self.test(text);
}

export const behaveAsRegExp = does(
  implement(IMatchable, {matches}));