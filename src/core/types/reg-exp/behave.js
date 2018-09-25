import {implement} from '../protocol';
import {does} from '../../core';
import {IMatch} from '../../protocols';

function matches(self, text){
  return self.test(text);
}

export default does(
  implement(IMatch, {matches}));