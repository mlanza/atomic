import {specify} from '../protocol';
import {IMatch, IEvented} from '../../protocols';
import {isRegExp, test} from '../reg-exp';
import {isString} from '../string/construct';
import {does, when} from '../../core';

function matches(self, pattern){
  if (isRegExp(pattern)){
    return test(pattern, decodeURI(self.href));
  } else if (isString(pattern)) {
    return decodeURI(self.href).indexOf(pattern) > -1;
  }
}

function on(self, pattern, callback){
  when(matches(self, pattern), callback);
}

export default does(
  specify(IEvented, {on}),
  specify(IMatch, {matches}));