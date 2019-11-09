import {implement} from '../protocol';
import {does} from '../../core';
import {IMatch} from '../../protocols';

function matches(self, text){
  return self.test(text);
}

export const behaveAsRegExp = does(
  implement(IMatch, {matches}));